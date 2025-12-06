import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

import { ResponseTimeInterceptor } from '@http/interceptors/response-time.interceptor';

describe('ResponseTimeInterceptor', () => {
  let interceptor: ResponseTimeInterceptor;
  beforeAll(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => 1000);
  });
  beforeEach(() => {
    interceptor = new ResponseTimeInterceptor();
    jest
      .spyOn(interceptor['logger'], 'log')
      .mockImplementation(() => undefined);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    (Date.now as jest.Mock).mockRestore();
  });

  const mockExecutionContext = (req: any, res: any): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => res,
      }),
    }) as unknown as ExecutionContext;

  const mockCallHandler = (onEnd?: () => void): CallHandler => ({
    handle: () => {
      if (onEnd) onEnd();
      return of(true);
    },
  });

  it('should log method, url, status and duration', (done) => {
    const req = { method: 'POST', url: '/test' };
    const res = { statusCode: 201 };

    const context = mockExecutionContext(req, res);

    let nowValue = 1000;
    jest.spyOn(Date, 'now').mockImplementation(() => {
      const val = nowValue;
      nowValue += 100;
      return val;
    });

    const handler = mockCallHandler();

    interceptor.intercept(context, handler).subscribe(() => {
      expect(interceptor['logger'].log).toHaveBeenCalledTimes(1);

      const logMsg = (interceptor['logger'].log as jest.Mock).mock.calls[0][0];

      expect(logMsg).toMatch(/POST \/test 201 \+100ms/);

      done();
    });
  });

  it('should use default values when request fields are missing', (done) => {
    const req = {};
    const res = {};

    const context = mockExecutionContext(req, res);

    let nowValue = 2000;
    jest.spyOn(Date, 'now').mockImplementation(() => {
      const val = nowValue;
      nowValue += 50;
      return val;
    });

    const handler = mockCallHandler();

    interceptor.intercept(context, handler).subscribe(() => {
      const logMsg = (interceptor['logger'].log as jest.Mock).mock.calls[0][0];

      expect(logMsg).toMatch(/UNKNOWN UNKNOWN 200 \+50ms/);

      done();
    });
  });

  it('should not modify response value', (done) => {
    const req = { method: 'GET', url: '/unchanged' };
    const res = { statusCode: 200 };

    const context = mockExecutionContext(req, res);

    const handler = {
      handle: () => of({ ok: true }),
    } as CallHandler;

    interceptor.intercept(context, handler).subscribe((value) => {
      expect(value).toEqual({ ok: true });
      done();
    });
  });
});
