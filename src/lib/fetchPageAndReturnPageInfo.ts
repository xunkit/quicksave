"use server";

import { maxinCharacterCountOfBookmarkTitle } from "@/constants";
import * as cheerio from "cheerio";

export default async function fetchPageAndReturnPageInfo(url: string) {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!response.ok) {
      throw new Error("Invalid link");
    }

    const html = await response.text();

    const $ = cheerio.load(html);
    const ogImage = $('meta[property="og:image"]').attr("content") || null;
    let title = $("title").text().trim() || null;

    if (title && title?.length > maxinCharacterCountOfBookmarkTitle) {
      title = title.substring(0, maxinCharacterCountOfBookmarkTitle) + "...";
    }

    return { ogImage, title };
  } catch (error) {
    throw error;
  }
}
