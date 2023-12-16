import { ICommand } from '@shared/interfaces/use-case.interface';

export class HealthCheckQuery implements ICommand<unknown> {

  payload: unknown;

  constructor(props: unknown) {
    this.payload = props;
  }

}
