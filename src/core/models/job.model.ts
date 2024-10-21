import { Bus } from '../events/bus';
import { PictureModel } from './picture.model';

export interface JobProperties {
  id: string;
  by: string;
  status: JobStatus;
  name: string;
  inputPicture?: PictureModel;
  startedAt?: string;
  finishedAt?: string;
  error?: string;
  outputPicture?: PictureModel;
}


type JobStatus = 'pending' | 'running' | 'step' | 'done' | 'failure';
export class JobModel {
  private _error: string;

  constructor(
    private readonly _id: string,
    private readonly _by: string,
    private readonly _name: string,
    private _status: JobStatus,
    private _startedAt?: string,
    private _inputPicture?: PictureModel,
    private _outputPicture?: PictureModel,
    private _finishedAt?: string,
  ) {}

  static createPendingJob(properties: {
    id: string;
    by: string;
    name: string;
  }) {
    const job = new JobModel(
      properties.id,
      properties.by,
      properties.name,
      'pending',
    );
    return job;
  }

  static createStartedJob(
    eventBus: Bus,
    properties: {
      id: string;
      by: string;
      name: string;
      startedAt: string;
      inputPictureId: string;
    },
  ) {
    const job = new JobModel(
      properties.id,
      properties.by,
      properties.name,
      'running',
      properties.startedAt,
      new PictureModel(properties.inputPictureId, properties.by),
    );
    return job;
  }

  static createDoneJob(properties: {
    id: string;
    by: string;
    name: string;
    startedAt: string;
    finishedAt: string;
    inputPictureId: string;
    outputPictureId: string;
  }) {
    const job = new JobModel(
      properties.id,
      properties.by,
      properties.name,
      'done',
      properties.startedAt,
      new PictureModel(properties.inputPictureId, properties.by),
      new PictureModel(properties.outputPictureId, properties.by),
      properties.finishedAt,
    );
    return job;
  }

  start(at: string, inputPicture: PictureModel) {
    this._status = 'running';
    this._startedAt = at;
    this._inputPicture = inputPicture;
  }
  done(at: string, outputPicture: PictureModel) {
    this._status = 'done';
    this._outputPicture = outputPicture;
    this._finishedAt = at;
  }
  fail(error: Error) {
    this._status = 'failure';
    this._error = error.message;
  }

  public get id(): string {
    return this._id;
  }

  public get by(): string {
    return this._by;
  }

  public get inputPicture() {
    return this._inputPicture;
  }

  public get outputPicture() {
    return this._outputPicture;
  }
  public get status(): JobStatus {
    return this._status;
  }

  public get startedAt(): string {
    return this._startedAt;
  }
  public get finishedAt(): string {
    return this._finishedAt;
  }

  public get error(): string {
    return this._error;
  }
  public get name(): string {
    return this._name;
  }

  public get properties(): JobProperties {
    return {
      id: this.id,
      by: this.by,
      status: this.status,
      name: this.name,
      startedAt: this.startedAt,
      error: this.error,
      inputPicture: this.inputPicture,
      outputPicture: this.outputPicture,
      finishedAt: this._finishedAt,
    };
  }
}
