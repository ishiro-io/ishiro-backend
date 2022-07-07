/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { AxiosInstance } from "axios";
import { setup, setupCache } from "axios-cache-adapter";
import { mapSeries } from "bluebird";
import ms from "ms";

import ADBAnime from "./models/adb-anime.model";
import ADBEpisode from "./models/adb-episode.model";

@Injectable()
export class AniDBService {
  private axios: AxiosInstance;

  private auth: Auth;

  constructor() {
    this.auth = {
      client: process.env.ANIDB_CLIENT_NAME ?? "",
      clientver: Number(process.env.ANIDB_CLIENT_VERSION),
    };

    const store = setupCache({ maxAge: ms("1h") });

    this.axios = setup({
      baseURL: "http://api.anidb.net:9001/httpapi",
      cache: {
        maxAge: ms("2w"),
        store,
        clearOnError: false,
        exclude: {
          query: false,
        },
        key: (req: any) => {
          const serialized =
            req.params instanceof URLSearchParams
              ? req.params.toString()
              : JSON.stringify(req.params) || "";
          return req.url + serialized;
        },
      },
    });
  }

  async getAnimeData(aid: number) {
    const { data } = await this.axios({
      method: "GET",
      url: `?request=anime`,
      params: { aid, ...this.auth, protover: 1 },
    });

    const anime = new ADBAnime();
    await anime.init(data);

    return anime;
  }

  async formatInputs(episodes: ADBEpisode[], animeId: number) {
    return mapSeries(episodes, (episode: ADBEpisode) =>
      this.formatInput(episode, animeId)
    ).then((entries) =>
      entries.filter((input): input is Prisma.EpisodeCreateInput => {
        return input !== null;
      })
    );
  }

  async formatInput(
    episode: ADBEpisode,
    animeId: number
  ): Promise<Prisma.EpisodeCreateInput | null> {
    const input: Prisma.EpisodeCreateInput = {
      title: episode.title,
      number: episode.epno,
      length: episode.length,
      airedDate: episode.date,
      anime: { connect: { id: animeId } },
    };

    return input;
  }
}

interface Auth {
  client: string;
  clientver: number;
}
