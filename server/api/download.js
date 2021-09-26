import { Router } from 'express';
import ytdl from 'ytdl-core';

const router = Router();

function sendError(res, {status = 500, message = 'No error message was provided'}) {
  res.status(status).json({
    error: {
      status,
      message
    }
  })
}

router.get('/', async (req, res) => {
  const {url} = req.query;
  
  if (!url) {
    return sendError(res, {
      status: 404,
      message: 'No URL was specified'
    });
  }

  if (!ytdl.validateURL(url)) {
    return sendError(res, {
      status: 400,
      message: 'An invalid Youtube video URL was provided'
    });
  }

  try {
    const metadata = await ytdl.getBasicInfo(url);
    
    const video = ytdl(url, {
      filter: 'videoandaudio',
      quality: 'highest',
      highWaterMark: 1 << 25
    });

    res.writeHead(200, {
      'title': metadata.videoDetails.title
    });
    video.pipe(res);
  } catch(err) {
    sendError(res, {
      message: err.message ?? 'An unknown error occured whilst downloading the Youtube video, please try again later'
    });
  }
});

export default router;