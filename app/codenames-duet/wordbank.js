// A broad, general-purpose word bank for Codenames Duet.
// Plain common nouns spanning many categories so clues stay varied from game to game.

export const WORD_BANK = [
  // Animals
  "TIGER", "EAGLE", "SHARK", "SPIDER", "WHALE", "OCTOPUS", "PANDA", "WOLF",
  "FALCON", "SNAKE", "RABBIT", "OTTER", "CAMEL", "DOLPHIN", "PENGUIN", "BEAR",
  "HORSE", "GOAT", "CROW", "BEE", "ANT", "BUTTERFLY", "SCORPION", "LIZARD",
  "TURTLE", "OWL", "FOX", "DEER", "BAT", "CRAB", "SEAL", "MOOSE", "LION",
  "PIGEON", "SWAN", "PEACOCK", "KANGAROO", "HIPPO", "RHINO", "ZEBRA", "GORILLA",

  // Food & drink
  "HONEY", "PEPPER", "OLIVE", "BREAD", "CHEESE", "NOODLE", "MANGO", "LEMON",
  "GINGER", "COCONUT", "PRETZEL", "WAFFLE", "SYRUP", "PICKLE", "SALSA", "STEW",
  "TOFU", "CINNAMON", "PEACH", "GRAPE", "MELON", "PUMPKIN", "POPCORN", "TACO",
  "SUSHI", "PASTA", "SOUP", "BACON", "CANDY", "COFFEE", "TEA", "CHOCOLATE",

  // Nature & weather
  "GLACIER", "VOLCANO", "DESERT", "CANYON", "FOREST", "ISLAND", "RIVER", "STORM",
  "THUNDER", "RAINBOW", "TORNADO", "AVALANCHE", "TIDE", "CLIFF", "MOUNTAIN", "CORAL",
  "SWAMP", "OASIS", "GEYSER", "CRATER", "REEF", "VALLEY", "MEADOW", "FROST",
  "CLOUD", "LIGHTNING", "SNOW", "DROUGHT", "ECLIPSE", "SUNRISE",

  // Geography & places
  "CASTLE", "BRIDGE", "TOWER", "PALACE", "TEMPLE", "HARBOR", "LIGHTHOUSE", "TUNNEL",
  "PYRAMID", "FORTRESS", "MARKET", "STADIUM", "MUSEUM", "LIBRARY", "AIRPORT", "STATION",
  "VILLAGE", "SUBURB", "CAPITAL", "BORDER", "COLONY", "EMBASSY", "PALACE", "PLAZA",

  // Objects & tools
  "HAMMER", "LADDER", "COMPASS", "LANTERN", "ANCHOR", "SHOVEL", "WRENCH", "MAGNET",
  "TELESCOPE", "MICROSCOPE", "SCISSORS", "UMBRELLA", "BLANKET", "PILLOW", "CANDLE", "MIRROR",
  "BASKET", "BUCKET", "ROPE", "CHAIN", "NAIL", "SCREW", "BRUSH", "NEEDLE",
  "KETTLE", "OVEN", "FRIDGE", "BATTERY", "ENGINE", "GEAR", "VALVE", "PIPE",

  // Technology
  "ROBOT", "SATELLITE", "ROCKET", "REACTOR", "CIRCUIT", "SENSOR", "DRONE", "SERVER",
  "LASER", "ANTENNA", "KEYBOARD", "SCREEN", "CAMERA", "PRINTER", "SPEAKER", "CHIP",

  // Transportation
  "SUBMARINE", "TRAIN", "GLIDER", "CANOE", "TRACTOR", "SLEIGH", "SCOOTER", "FERRY",
  "BALLOON", "CARRIAGE", "YACHT", "HELICOPTER", "TRUCK", "BICYCLE", "WAGON", "RAFT",

  // Sports & games
  "TROPHY", "STADIUM", "REFEREE", "MARATHON", "ARCHERY", "FENCING", "HOCKEY", "BOWLING",
  "CHESS", "PUZZLE", "DOMINO", "DICE", "DARTS", "GOLF", "SURFING", "SKATING",

  // Professions & people
  "PILOT", "WIZARD", "KNIGHT", "PIRATE", "DETECTIVE", "ASTRONAUT", "FARMER", "SAILOR",
  "CHEF", "DOCTOR", "ARTIST", "TEACHER", "JUDGE", "SPY", "MECHANIC", "DIVER",
  "EXPLORER", "SCIENTIST", "ARCHITECT", "PAINTER", "MUSICIAN", "DANCER", "ATHLETE", "SCOUT",

  // Body
  "SHOULDER", "ELBOW", "ANKLE", "SPINE", "SKULL", "MUSCLE", "PULSE", "BREATH",

  // Buildings & structures
  "CHIMNEY", "BASEMENT", "ATTIC", "BALCONY", "STAIRCASE", "FOUNTAIN", "GARDEN", "FENCE",
  "GATE", "WELL", "BARN", "WINDMILL", "COTTAGE", "CABIN", "GREENHOUSE", "SHED",

  // Abstract & concepts
  "MYSTERY", "FREEDOM", "JOURNEY", "LEGEND", "SHADOW", "ECHO", "MIRAGE", "HORIZON",
  "MEMORY", "SILENCE", "COURAGE", "FORTUNE", "DESTINY", "CHAOS", "HARMONY", "BALANCE",
  "SIGNAL", "PATTERN", "PUZZLE", "RIDDLE", "SECRET", "TREASURE", "VICTORY", "REBELLION",

  // Fantasy & myth
  "DRAGON", "PHOENIX", "GHOST", "VAMPIRE", "MERMAID", "UNICORN", "GIANT", "GOBLIN",
  "WITCH", "ORACLE", "SPHINX", "TITAN", "SPIRIT", "DEMON", "ANGEL", "GOLEM",

  // Space
  "GALAXY", "COMET", "METEOR", "NEBULA", "ORBIT", "ASTEROID", "ECLIPSE", "STARDUST",
  "MOON", "MARS", "SATURN", "COSMOS", "SUPERNOVA", "BLACKHOLE", "GRAVITY", "SPACESHIP",

  // Music & art
  "TRUMPET", "VIOLIN", "DRUM", "GUITAR", "PIANO", "ORCHESTRA", "MELODY", "RHYTHM",
  "SCULPTURE", "CANVAS", "PALETTE", "MOSAIC", "SKETCH", "GALLERY", "STATUE", "MURAL",

  // Clothing
  "CROWN", "CAPE", "HELMET", "GLOVE", "BOOT", "SCARF", "MASK", "ARMOR",

  // School & office
  "PENCIL", "NOTEBOOK", "STAMP", "ENVELOPE", "CALENDAR", "CLIPBOARD", "FOLDER", "LABEL",

  // Time
  "CENTURY", "DECADE", "SEASON", "TWILIGHT", "MIDNIGHT", "DAWN", "CALENDAR", "CLOCK",

  // Money & business
  "TREASURE", "FORTUNE", "COIN", "VAULT", "MARKET", "TRADE", "CONTRACT", "AUCTION",

  // Misc everyday
  "BALLOON", "KITE", "KEY", "KNOT", "KNIFE", "BELL", "FLAG", "MAP",
  "COMPASS", "BOTTLE", "JAR", "BOX", "CRATE", "BARREL", "SACK", "CHEST",
];

export function getRandomBoardWords(count = 25) {
  const pool = Array.from(new Set(WORD_BANK));
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}
