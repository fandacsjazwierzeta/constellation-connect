import { CHAPTER_SIZE } from '../constants/config';
import { STAR_IDS, TEMPLATES, TEMPLATE_COUNT } from './templates';
import { TRANSFORMS } from './transforms';
import type { CatalogEntry, Chapter, Puzzle, Star, Tier } from './types';

const CHAPTERS: Chapter[] = ['Spring', 'Summer', 'Autumn', 'Winter'];

interface RawRow {
  name: string;
  tale: string;
}

/** 88 rows in catalogue order: 22 Spring, 22 Summer, 22 Autumn, 22 Winter. */
const ROWS: RawRow[] = [
  { name: 'Leo', tale: 'A patient lion gathers scattered sparks into a mane bright enough to welcome the dawn.' },
  { name: 'Virgo', tale: 'A careful gardener plants a handful of starlight and waits for the sky to bloom.' },
  { name: 'Bootes', tale: 'A sky shepherd guides wandering lights home, one gentle step at a time.' },
  { name: 'Coma Berenices', tale: 'A ribbon of shining hair drifts upward and becomes a gift to the night.' },
  { name: 'Corvus', tale: 'A clever raven carries a silver message across the quiet sky.' },
  { name: 'Crater', tale: 'A small cup catches the first drops of moonlight for a midnight feast.' },
  { name: 'Hydra', tale: 'A long water serpent curls around islands of light without disturbing a single star.' },
  { name: 'Canes Venatici', tale: 'Two faithful hounds follow a trail of sparks and find their friend waiting among the stars.' },
  { name: 'Ursa Major', tale: 'A great bear leaves bright pawprints for travelers crossing the dark.' },
  { name: 'Ursa Minor', tale: 'A little bear keeps one steady lantern while the rest of the sky turns.' },
  { name: 'Leo Minor', tale: 'A young lion discovers that even a small roar can make the night feel brave.' },
  { name: 'Lynx', tale: 'A quiet lynx notices the faintest lights and threads them into a secret path.' },
  { name: 'Cancer', tale: 'A tiny crab carries a borrowed spark safely across a moonlit shore.' },
  { name: 'Sextans', tale: 'A patient explorer measures the darkness and discovers room for one more dream.' },
  { name: 'Antlia', tale: 'A little air pump fills a cloud with enough breeze to sail past the moon.' },
  { name: 'Centaurus', tale: 'A wise sky wanderer shares a lantern with everyone learning the road.' },
  { name: 'Lupus', tale: 'A silver wolf listens for its pack in the spaces between the stars.' },
  { name: 'Crux', tale: 'Four lights become a small crossing where distant travelers exchange stories.' },
  { name: 'Chamaeleon', tale: 'A shy chameleon borrows the colors of twilight and leaves a trail of quiet sparks.' },
  { name: 'Musca', tale: 'A tiny fly circles a lantern and discovers that small things belong in big skies.' },
  { name: 'Libra', tale: 'A pair of sky scales balances one brave wish against another kind deed.' },
  { name: 'Carina', tale: 'A sturdy ship’s keel carries a whole crew of dreams through the night.' },
  { name: 'Lyra', tale: 'A little harp plays a tune so soft that the stars lean closer to listen.' },
  { name: 'Cygnus', tale: 'A swan glides along a river of light, leaving the water smooth behind it.' },
  { name: 'Aquila', tale: 'An eagle carries a sunrise feather high above the sleeping world.' },
  { name: 'Hercules', tale: 'A strong traveler learns that helping a friend can be the greatest adventure.' },
  { name: 'Ophiuchus', tale: 'A gentle guardian guides a wandering serpent through a garden of stars.' },
  { name: 'Serpens', tale: 'A curious serpent follows a winding ribbon until it reaches a warm little light.' },
  { name: 'Scorpius', tale: 'A small scorpion raises its shining tail to point out a hidden path.' },
  { name: 'Sagittarius', tale: 'A sky archer sends a wish toward the farthest light and waits with hope.' },
  { name: 'Corona Borealis', tale: 'A northern crown holds a circle of sparks gathered for a friend.' },
  { name: 'Draco', tale: 'A sleepy dragon curls around a treasure made entirely of stories.' },
  { name: 'Delphinus', tale: 'A dolphin leaps between bright waves and invites the stars to play.' },
  { name: 'Sagitta', tale: 'A tiny arrow finds its way by following kindness rather than speed.' },
  { name: 'Scutum', tale: 'A bright shield shelters a cluster of young stars from a passing cloud.' },
  { name: 'Vulpecula', tale: 'A little fox hides a spark, then shares the secret with a lonely traveler.' },
  { name: 'Corona Australis', tale: 'A southern crown rests on the horizon, waiting for a storyteller to claim it.' },
  { name: 'Ara', tale: 'A quiet altar holds a lantern for every promise kept beneath the sky.' },
  { name: 'Telescopium', tale: 'A patient telescope discovers that distant wonders reward a careful look.' },
  { name: 'Norma', tale: 'A builder’s square helps a dreamer make a sturdy bridge of light.' },
  { name: 'Triangulum Australe', tale: 'Three southern lights agree that every journey needs a place to begin.' },
  { name: 'Circinus', tale: 'A pair of drawing compasses makes a circle large enough to welcome everyone.' },
  { name: 'Apus', tale: 'A bird of paradise spreads a bright fan of wishes across the dark.' },
  { name: 'Pavo', tale: 'A proud peacock opens its tail and discovers a whole garden of stars.' },
  { name: 'Pegasus', tale: 'A winged horse carries a dream beyond the edge of the clouds.' },
  { name: 'Andromeda', tale: 'A brave sky traveler follows a chain of lights toward a new adventure.' },
  { name: 'Pisces', tale: 'Two fish follow the same silver thread and never lose each other in the dark.' },
  { name: 'Aquarius', tale: 'A water bearer pours a shining stream to refresh the gardens of the sky.' },
  { name: 'Capricornus', tale: 'A sea goat climbs a moonlit wave to see what waits beyond the horizon.' },
  { name: 'Cetus', tale: 'A great sea creature hums a gentle song beneath a floating field of stars.' },
  { name: 'Sculptor', tale: 'An artist shapes a quiet patch of darkness into a place for wonder.' },
  { name: 'Fornax', tale: 'A small furnace keeps a workshop warm while new dreams take shape.' },
  { name: 'Phoenix', tale: 'A bright bird rises with a fresh feather for every new beginning.' },
  { name: 'Grus', tale: 'A crane takes one careful step, then another, across a silver marsh.' },
  { name: 'Tucana', tale: 'A toucan carries a colorful story from one end of the night to the other.' },
  { name: 'Indus', tale: 'A quiet explorer listens to the sky and finds a path by sharing stories.' },
  { name: 'Microscopium', tale: 'A small instrument reveals a whole universe hiding inside an ordinary drop.' },
  { name: 'Piscis Austrinus', tale: 'A southern fish catches a fallen spark and returns it to the sky.' },
  { name: 'Lacerta', tale: 'A little lizard warms itself beside the last gold light of evening.' },
  { name: 'Cepheus', tale: 'A thoughtful king keeps a lamp burning for every traveler still on the road.' },
  { name: 'Cassiopeia', tale: 'A queen arranges five lights into a chair where the night can rest.' },
  { name: 'Equuleus', tale: 'A little horse discovers that short steps can still lead to distant places.' },
  { name: 'Triangulum', tale: 'Three bright corners turn an empty space into a tiny home for a wish.' },
  { name: 'Perseus', tale: 'A brave adventurer carries a mirror of light and chooses a gentle way forward.' },
  { name: 'Hydrus', tale: 'A small water snake draws ripples around a sleeping island of stars.' },
  { name: 'Octans', tale: 'A navigator measures a quiet angle and finds the courage to set sail.' },
  { name: 'Orion', tale: 'A tall sky wanderer fastens a shining belt before another journey through the night.' },
  { name: 'Taurus', tale: 'A sturdy bull carries a cluster of lanterns across a frosty field.' },
  { name: 'Gemini', tale: 'Two companions promise to meet beneath the same lights wherever their journeys lead.' },
  { name: 'Auriga', tale: 'A careful charioteer steers a little cart of wishes around the sleeping moon.' },
  { name: 'Canis Major', tale: 'A great dog runs ahead to light the path for its friends.' },
  { name: 'Canis Minor', tale: 'A small dog keeps pace with a big adventure and never stops wagging.' },
  { name: 'Lepus', tale: 'A quick hare pauses in the snow to admire a sky full of tiny lanterns.' },
  { name: 'Monoceros', tale: 'A quiet unicorn touches the darkness and leaves a trail of gentle light.' },
  { name: 'Eridanus', tale: 'A long river carries messages from mountain snow to the farthest sea.' },
  { name: 'Columba', tale: 'A dove brings a small olive-colored wish to a peaceful corner of the sky.' },
  { name: 'Caelum', tale: 'A sculptor’s chisel gives a hidden spark enough room to shine.' },
  { name: 'Dorado', tale: 'A bright fish darts through a dark current and scatters a handful of glittering bubbles.' },
  { name: 'Horologium', tale: 'A patient clock counts the quiet moments between one wonder and the next.' },
  { name: 'Mensa', tale: 'A flat-topped mountain offers the stars a peaceful place to gather.' },
  { name: 'Pictor', tale: 'A painter sets an easel beneath the sky and borrows its gentlest colors.' },
  { name: 'Reticulum', tale: 'A fine little net catches scattered sparks and carefully returns them to their places.' },
  { name: 'Vela', tale: 'A ship raises its sails to catch a breeze made of whispered wishes.' },
  { name: 'Puppis', tale: 'A ship’s stern leaves a silver wake for the next traveler to follow.' },
  { name: 'Pyxis', tale: 'A small compass reminds a lost dreamer that a new direction is always possible.' },
  { name: 'Volans', tale: 'A flying fish leaps above the water to greet a passing star.' },
  { name: 'Aries', tale: 'A brave ram climbs a bright ridge and waits for its friends at the top.' },
  { name: 'Camelopardalis', tale: 'A gentle giraffe stretches toward the lights and discovers there is always more to see.' },
];

const tierFor = (templateIndex: number): Tier => {
  if (templateIndex < 3) return 'Gentle';
  if (templateIndex < 7) return 'Curious';
  return 'Deep Sky';
};

export const CATALOG: CatalogEntry[] = ROWS.map((row, i) => ({
  id: i + 1,
  name: row.name,
  tale: row.tale,
  chapter: CHAPTERS[Math.floor(i / CHAPTER_SIZE)],
  tier: tierFor(i % TEMPLATE_COUNT),
}));

export const edgeKey = (a: string, b: string): string => (a < b ? a + '-' + b : b + '-' + a);

export const edgeEnds = (key: string): [string, string] => {
  const parts = key.split('-');
  return [parts[0], parts[1]];
};

const puzzleCache = new Map<number, Puzzle>();

/** Deterministic: entry index i uses template (i mod 11) and transform floor(i / 11). */
export const getPuzzle = (id: number): Puzzle => {
  const cached = puzzleCache.get(id);
  if (cached) return cached;

  const entry = CATALOG[id - 1] || CATALOG[0];
  const index = entry.id - 1;
  const template = TEMPLATES[index % TEMPLATE_COUNT];
  const transform = TRANSFORMS[Math.floor(index / TEMPLATE_COUNT) % TRANSFORMS.length];

  const degree: Record<string, number> = {};
  template.edges.forEach(pair => {
    degree[pair[0]] = (degree[pair[0]] || 0) + 1;
    degree[pair[1]] = (degree[pair[1]] || 0) + 1;
  });

  const stars: Star[] = template.points.map((pt, i) => {
    const starId = STAR_IDS[i];
    const moved = transform(pt);
    return { id: starId, x: moved.x, y: moved.y, required: degree[starId] || 0 };
  });

  const solution = template.edges.map(pair => edgeKey(pair[0], pair[1])).sort();

  const puzzle: Puzzle = {
    id: entry.id,
    name: entry.name,
    chapter: entry.chapter,
    tale: entry.tale,
    tier: entry.tier,
    stars,
    solution,
  };
  puzzleCache.set(id, puzzle);
  return puzzle;
};

export const chapterEntries = (chapter: Chapter): CatalogEntry[] =>
  CATALOG.filter(entry => entry.chapter === chapter);

export const CHAPTER_LIST = CHAPTERS;
