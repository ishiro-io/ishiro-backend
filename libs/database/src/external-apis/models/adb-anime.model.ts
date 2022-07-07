/* eslint-disable @typescript-eslint/no-explicit-any */
import { parseStringPromise } from "xml2js";

import ADBEpisode from "./adb-episode.model";

class ADBAnime {
  id: number | undefined;

  episodes: ADBEpisode[] | undefined;

  async init(data: string): Promise<ADBAnime> {
    const { anime } = await parseStringPromise(data);

    const episodes = anime.episodes?.[0].episode
      .filter((e: any) => !Number.isNaN(Number(e.epno?.[0]._)))
      .sort((a: any, b: any) => Number(a.epno?.[0]._) - Number(b.epno?.[0]._))
      .map((e: any) => new ADBEpisode(e));

    this.id = anime?.$?.id;
    this.episodes = episodes;

    return this;
  }
}

export default ADBAnime;
