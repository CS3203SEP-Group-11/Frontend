import { render } from '@testing-library/react';
import VideoPlayer from '../VideoPlayer';

describe('VideoPlayer', () => {
  test('renders video element with src', () => {
    const { container } = render(<VideoPlayer src="https://example.com/video.mp4" />);
    const video = container.querySelector('video');
    expect(video).toBeTruthy();
    expect(video?.getAttribute('src')).toBe('https://example.com/video.mp4');
  });

  test('applies controlsList attributes when disabling download', () => {
    const { container } = render(<VideoPlayer src="a.mp4" disableDownload disableFullscreen />);
    const video = container.querySelector('video');
    const controlsList = video?.getAttribute('controlslist') || video?.getAttribute('controlsList');
    expect(controlsList).toMatch(/nodownload/);
    expect(controlsList).toMatch(/nofullscreen/);
  });
});
