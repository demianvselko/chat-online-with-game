import { UrlVO } from '@domain/shared/value-objects/url.vo';
import { expectDomainError } from '@test/utils/expect-domain-error';
describe('UrlVO', () => {
  it('should create a UrlVO with a valid URL', () => {
    const validUrl = 'https://example.com/path?query=123';
    const vo = UrlVO.create(validUrl);
    expect(vo.value).toBe('https://example.com/path?query=123');
  });

  it('should trim whitespace from input', () => {
    const urlWithWhitespace = '   https://example.com/path?query=123   ';
    const vo = UrlVO.create(urlWithWhitespace);
    expect(vo.value).toBe('https://example.com/path?query=123');
  });

  it('should normalize the URL through URL.href', () => {
    const urlWithoutTrailingSlash = 'https://example.com';
    const vo = UrlVO.create(urlWithoutTrailingSlash);
    expect(vo.value).toBe('https://example.com/');
  });

  it('should throw DomainError when URL is invalid', () => {
    const invalidUrl = 'invalid-url';
    expectDomainError(() => UrlVO.create(invalidUrl), 'INVALID_URL', {
      url: invalidUrl,
    });
  });

  it('should throw DomainError for relative URLs', () => {
    const relativeUrl = '/relative/path';
    expectDomainError(() => UrlVO.create(relativeUrl), 'INVALID_URL', {
      url: relativeUrl,
    });
  });

  it('should keep normalized URL value', () => {
    const raw = 'HTTP://EXAMPLE.COM/UPPERCASE';
    const vo = UrlVO.create(raw);
    expect(vo.value).toBe('http://example.com/UPPERCASE');
  });
});
