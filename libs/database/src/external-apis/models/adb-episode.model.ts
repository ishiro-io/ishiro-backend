/* eslint-disable @typescript-eslint/no-explicit-any */
class ADBEpisode {
  epno: number;

  length: number;

  date: Date;

  title: string;

  constructor(data: any) {
    const frenchTitle = data?.title?.find((t: any) => t?.$["xml:lang"] === "fr")
      ?._;

    const englishTitle = data?.title?.find(
      (t: any) => t?.$["xml:lang"] === "en"
    )?._;

    this.epno = Number(data?.epno?.[0]._);
    this.length = Number(data?.length?.[0]);
    this.date = new Date(data?.airdate?.[0]);
    this.title = frenchTitle || englishTitle;
  }
}

export default ADBEpisode;
