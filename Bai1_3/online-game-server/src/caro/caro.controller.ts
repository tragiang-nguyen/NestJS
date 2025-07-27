import { Controller, Get, Post, Body, Res, Render } from '@nestjs/common';
import { CaroService } from './caro.service';
import { Response } from 'express';

@Controller('caro')
export class CaroController {
  constructor(private readonly caroService: CaroService) {}

  @Get()
  @Render('caro')
  root() {
    return {};
  }

  @Get('init')
  init(@Res() res: Response) {
    const { board, status } = this.caroService.getInitialState();
    res.json({ board, status });
  }

  @Post('move')
  move(@Body() body: { row: number; col: number }, @Res() res: Response) {
    const { board, status, gameActive, message } = this.caroService.handleMove(body.row, body.col);
    res.json({ board, status, gameActive, message });
  }

  @Post('restart')
  restart(@Res() res: Response) {
    const { board, status } = this.caroService.handleRestart();
    res.json({ board, status });
  }
}