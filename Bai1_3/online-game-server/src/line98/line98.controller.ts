import { Controller, Get, Post, Body, Res, Render } from '@nestjs/common';
import { Line98Service } from './line98.service';
import { Response } from 'express';

@Controller('line98')
export class Line98Controller {
  constructor(private readonly line98Service: Line98Service) {}

  @Get()
  @Render('line98')
  root() {
    return {};
  }

  @Get('init')
  init(@Res() res: Response) {
    const state = this.line98Service.getInitialState();
    res.json(state);
  }

  @Post('move')
  move(@Body() body: { row: number; col: number }, @Res() res: Response) {
    const state = this.line98Service.handleMove(body.row, body.col);
    res.json(state);
  }

  @Post('restart')
  restart(@Res() res: Response) {
    const state = this.line98Service.handleRestart();
    res.json(state);
  }

  @Post('help')
  help(@Res() res: Response) {
    const state = this.line98Service.getHelpMove();
    res.json(state);
  }
}