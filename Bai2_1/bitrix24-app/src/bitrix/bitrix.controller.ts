import { Controller, Get, Query, Post, Body, Res, Request } from '@nestjs/common';
import { BitrixService } from './bitrix.service';
import { Response } from 'express';

@Controller('bitrix')
export class BitrixController {
  constructor(private bitrixService: BitrixService) {}

  @Get('authorize')
  async authorize(@Res() res: Response) {
    const authUrl = await this.bitrixService.getAuthorizationUrl();
    console.log('Generated auth URL:', authUrl);
    res.redirect(authUrl);
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Res() res: Response): Promise<any> {
    console.log('Callback query:', { code });
    if (!code) return res.status(400).send({ error: 'No code received' });
    try {
      const tokens = await this.bitrixService.getTokens(code);
      this.bitrixService.saveTokens(tokens);
      res.send({ message: 'Authorized successfully', tokens });
    } catch (error) {
      console.error('Callback error:', error.message, error.response?.data);
      res.status(500).send({ error: 'Authorization failed', details: error.message });
    }
  }

  @Post('handling')
  async handling(@Res() res: Response): Promise<any> {
    console.log('Handling event received');
    res.send({ status: 'handling endpoint active' });
  }

  @Post('install')
  async install(@Body() body: any, @Query() query: any, @Res() res: Response, @Request() req: any): Promise<any> {
    console.log('Install event received - Body:', body);
    console.log('Install event received - Query:', query);
    console.log('Install event received - Headers:', req.headers);

    // Lấy dữ liệu xác thực từ body
    const authData = {
      access_token: body.AUTH_ID,
      refresh_token: body.REFRESH_ID,
      expires_in: parseInt(body.AUTH_EXPIRES, 10),
      domain: query.DOMAIN,
      member_id: body.member_id,
    };

    if (!authData.access_token || !authData.refresh_token || !authData.domain) {
      console.log('Missing required auth data:', authData);
      return res.status(400).send({ error: 'Missing required auth data', received: { body, query, headers: req.headers } });
    }

    try {
      this.bitrixService.saveInstallAuth(authData);
      res.send({ status: 'install successful', auth: authData });
    } catch (error) {
      console.error('Install error:', error.message);
      res.status(500).send({ error: 'Install failed', details: error.message });
    }
  }

  @Post('api')
  async callApi(@Body() body: { endpoint: string; action: string; payload: any }, @Res() res: Response): Promise<any> {
    const { endpoint, action, payload } = body;
    try {
      const result = await this.bitrixService.callApi(endpoint, action, payload);
      res.send(result);
    } catch (error) {
      console.error('API call error:', error.message);
      res.status(500).send({ error: 'API call failed' });
    }
  }
}