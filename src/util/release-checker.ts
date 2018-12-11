import * as rp from 'request-promise';
import logger from '../util/logger';

/**
 * Returns true of movie has been released, false otherwise
 * @param imdbid - movie id from imdb
 */
export async function checkMovieRelease(imdbid: string): Promise<Boolean> {
  logger.debug(undefined, 'Checking release for movie %s', imdbid);

  const url = `http://api.apiumando.info/movie?cb=&quality=720p,1080p,3d&page=1&imdb=${imdbid}`;
  let response;

  try {
    response = await rp.get(url);
  } catch (e) {
    return false;
  }

  const torrents = JSON.parse(response);

  return torrents.items && torrents.items.length > 0;
}

export async function checkRussianMovieRelease(title: string, year: string) {
  // For the future purposes... If there will be a day when I'll use filmopotok.ru for russian torrents
  // As for now, I can't determine whether the torrents has a good or bad quality (e.g. ad, etc)
  // Use this values to determine whether the quality "seems" to be good or not
  // translation >= 25
  // quality >= 12
  logger.debug(undefined, 'Checking russian release for movie %s', title);

  const url = encodeURI(`http://filmpotok.ru/search/autocomplete/all/${title}`);
  let response;

  try {
    response = await rp.get(url);
  } catch (e) {
    return false;
  }

  let movieUrl = undefined;
  const torrents = JSON.parse(response)[1];
  for (const key in torrents) {
    if (
      torrents[key].label.match(/<i>(.*?)<\/i>/)[1].toLowerCase() === title.toLowerCase() &&
      torrents[key].label.match(/> \((\d{4})/)[1] === year
    ) {
      movieUrl = torrents[key].href;
      break;
    }
  }

  if (!movieUrl) return false;

  console.log(movieUrl);
}
