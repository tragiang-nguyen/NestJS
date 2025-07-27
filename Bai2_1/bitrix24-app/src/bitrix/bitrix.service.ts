import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BitrixService {
  private tokensFile = path.join(__dirname, '..', 'tokens.json');
  private installAuthFile = path.join(__dirname, '..', 'install_auth.json');

  constructor(private configService: ConfigService, private httpService: HttpService) {}

  async getAuthorizationUrl(): Promise<string> {
    const clientId = this.configService.get<string>('CLIENT_ID');
    const redirectUri = this.configService.get<string>('REDIRECT_URI');
    const domain = this.configService.get<string>('BITRIX_DOMAIN');
    return `https://${domain}/oauth/authorize/?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
  }

  async getTokens(code: string): Promise<any> {
    const clientId = this.configService.get<string>('CLIENT_ID');
    const clientSecret = this.configService.get<string>('CLIENT_SECRET');
    const redirectUri = this.configService.get<string>('REDIRECT_URI');

    const response: AxiosResponse = await this.httpService.axiosRef.post(
      'https://tragiang.bitrix24.vn/oauth/token/',
      {
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      },
    ).catch(error => {
      console.error('Token request failed:', error.response?.data || error.message);
      throw error;
    });
    return response.data;
  }

  async renewToken(refreshToken: string): Promise<any> {
    const clientId = this.configService.get<string>('CLIENT_ID');
    const clientSecret = this.configService.get<string>('CLIENT_SECRET');

    const response: AxiosResponse = await this.httpService.axiosRef.post(
      'https://tragiang.bitrix24.vn/oauth/token/',
      {
        grant_type: 'refresh_token',
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
      },
    ).catch(error => {
      console.error('Refresh token failed:', error.response?.data || error.message);
      throw error;
    });
    return response.data;
  }

  async callApi(endpoint: string, action: string, payload: any): Promise<any> {
    let authData = this.loadInstallAuth();
    // Giữ nguyên logic mô phỏng để kiểm tra
    // const simulatedCreatedAt = 1721928844000; // 08:34 PM hôm nay
    // if (!authData || Date.now() / 1000 > (authData.expires_in + (simulatedCreatedAt / 1000))) {
    //   console.log('Token expired or not found, renewing... (simulated)');
    //   try {
    //     authData = await this.renewToken(authData.refresh_token);
    //     this.saveInstallAuth(authData);
    //   } catch (error) {
    //     console.error('Renew token error:', error.message, error.response?.data);
    //     throw error;
    //   }
    // }
    if (!authData) {
      throw new Error('No auth data found');
    }

    const domain = authData.domain;
    try {
      const response: AxiosResponse = await this.httpService.axiosRef.post(
        `https://${domain}/rest/${endpoint}`,
        payload,
        {
          params: { action },
          headers: { Authorization: `Bearer ${authData.access_token}` },
          timeout: 10000,
        },
      );
      return response.data;
    } catch (error) {
      console.error('API call failed:', error.message, error.response?.data);
      throw error;
    }
  }

  private loadTokens(): any {
    try {
      if (fs.existsSync(this.tokensFile)) {
        const data = fs.readFileSync(this.tokensFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Load tokens error:', error.message);
    }
    return null;
  }

  public saveTokens(tokens: any): void {
    try {
      tokens.created_at = Date.now();
      fs.writeFileSync(this.tokensFile, JSON.stringify(tokens, null, 2));
      console.log('Tokens saved:', tokens);
    } catch (error) {
      console.error('Save tokens error:', error.message);
    }
  }

  public saveInstallAuth(authData: any): void {
    try {
      // Thêm created_at nếu chưa có
      authData.created_at = authData.created_at || Date.now();
      fs.writeFileSync(this.installAuthFile, JSON.stringify(authData, null, 2));
      console.log('Install auth saved:', authData);
    } catch (error) {
      console.error('Save install auth error:', error.message);
    }
  }

  public loadInstallAuth(): any {
    try {
      if (fs.existsSync(this.installAuthFile)) {
        const data = fs.readFileSync(this.installAuthFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Load install auth error:', error.message);
    }
    return null;
  }
}