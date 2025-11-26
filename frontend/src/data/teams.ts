
import { Team } from "@/types";

export const teams: Team[] = [
  {
    id: "1",
    name: "Thunder Smash",
    group: "A",
    active: true,
    players: [
      { id: "1-1", name: "Marko Jovanović", role: "main" },
      { id: "1-2", name: "Stefan Nikolić", role: "main" },
      { id: "1-3", name: "Luka Petrović", role: "reserve" },
    ],
  },
  {
    id: "2",
    name: "Net Warriors",
    group: "A",
    active: true,
    players: [
      { id: "2-1", name: "Milan Stojanović", role: "main" },
      { id: "2-2", name: "Nikola Đorđević", role: "main" },
    ],
  },
  {
    id: "3",
    name: "Court Kings",
    group: "A",
    active: true,
    players: [
      { id: "3-1", name: "Aleksandar Ilić", role: "main" },
      { id: "3-2", name: "Dušan Pavlović", role: "main" },
      { id: "3-3", name: "Igor Stanković", role: "reserve" },
    ],
  },
  {
    id: "4",
    name: "Ace Strikers",
    group: "A",
    active: true,
    players: [
      { id: "4-1", name: "Nemanja Milošević", role: "main" },
      { id: "4-2", name: "Vladimir Popović", role: "main" },
    ],
  },
  {
    id: "5",
    name: "Power Serve",
    group: "B",
    active: true,
    players: [
      { id: "5-1", name: "Danilo Kostić", role: "main" },
      { id: "5-2", name: "Uroš Živković", role: "main" },
      { id: "5-3", name: "Bojan Marinković", role: "reserve" },
    ],
  },
  {
    id: "6",
    name: "Glass Smashers",
    group: "B",
    active: true,
    players: [
      { id: "6-1", name: "Dejan Todorović", role: "main" },
      { id: "6-2", name: "Miloš Simić", role: "main" },
    ],
  },
  {
    id: "7",
    name: "Volley Legends",
    group: "B",
    active: true,
    players: [
      { id: "7-1", name: "Darko Savić", role: "main" },
      { id: "7-2", name: "Filip Radović", role: "main" },
      { id: "7-3", name: "Slobodan Vasić", role: "reserve" },
    ],
  },
  {
    id: "8",
    name: "Smash Bros",
    group: "B",
    active: true,
    players: [
      { id: "8-1", name: "Goran Tomić", role: "main" },
      { id: "8-2", name: "Mladen Ristić", role: "main" },
    ],
  },
];
