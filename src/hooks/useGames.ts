import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { GameQuery } from "../App";
import APIClient from "../services/api-client";
import ms from "ms";

const apiClient = new APIClient<Game>("/games");

export type FetchResponse<T> = {
  count: number;
  next: string | null;
  results: T[];
};
export interface Platform {
  id: number;
  name: string;
  slug: string;
}

export interface Game {
  id: number;
  name: string;
  background_image: string;
  parent_platforms: { platform: Platform }[];
  metacritic: number;
  rating_top: number;
}

const useGames = (gameQuery: GameQuery) =>
  // useQuery<FetchResponse<Game>, Error>({
  //   queryKey: ["games", gameQuery],
  //   queryFn: () =>
  //     apiClient.getAll({
  //       params: {
  //         genres: gameQuery.genreId,
  //         platforms_parents: gameQuery.platformId,
  //         ordering: gameQuery.sortOrder,
  //         search: gameQuery.searchText,
  //       },
  //     }),
  // });

  useInfiniteQuery<FetchResponse<Game>, Error>({
    queryKey: ["games", gameQuery],
    queryFn: ({ pageParam = 1 }) =>
      apiClient.getAll({
        params: {
          genres: gameQuery.genreId,
          platforms_parents: gameQuery.platformId,
          ordering: gameQuery.sortOrder,
          search: gameQuery.searchText,
          page: pageParam,
        },
      }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length + 1 : undefined,
    staleTime: ms("24h"),
  });

export default useGames;
