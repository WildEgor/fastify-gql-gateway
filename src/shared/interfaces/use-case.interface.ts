export interface ICommand<TP> {
  payload: TP;
}

export interface IUseCase<TP, TR> {
  execute(cmd: ICommand<TP>): Promise<TR>
}
