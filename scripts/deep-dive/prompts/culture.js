// Curated prompt bank — culture, sport and entertainment.

export default [
  {
    id: "sport",
    text: "Name a sport",
    answers:
      "football|soccer, rugby, cricket, tennis, basketball, baseball, golf, swimming, athletics, running, cycling, boxing, wrestling, judo, karate, taekwondo, fencing, archery, shooting, rowing, sailing, canoeing, kayaking, surfing, skiing, snowboarding, skating, ice skating, figure skating, ice hockey, hockey, field hockey, lacrosse, netball, volleyball, badminton, squash, table tennis|ping pong, handball, gymnastics, diving, triathlon, marathon, hurdling, javelin, discus, shot put, high jump, long jump, pole vault, weightlifting, bodybuilding, climbing, bouldering, skateboarding, bmx, motocross, formula one, motor racing, rally, horse racing, showjumping, dressage, polo, darts, snooker, pool, bowling, curling, bobsleigh, luge, biathlon, water polo, synchronised swimming, sumo, mma, kickboxing, jiu jitsu, capoeira, parkour, orienteering, croquet, bowls, tug of war, dodgeball, ultimate frisbee, korfball, pickleball, padel, kabaddi, hurling, gaelic football, aussie rules",
    bias: { football: 2, tennis: 1.4, basketball: 1.3, running: 0.5, pool: 0.1, bowls: 0.1 },
  },
  {
    id: "instrument",
    text: "Name a musical instrument",
    answers:
      "piano, guitar, violin, drums, flute, clarinet, saxophone, trumpet, trombone, tuba, french horn, cello, double bass, viola, harp, oboe, bassoon, piccolo, recorder, accordion, harmonica, banjo, ukulele, mandolin, sitar, bagpipes, organ, keyboard, synthesizer, xylophone, glockenspiel, marimba, vibraphone, tambourine, triangle, cymbals, gong, bongos, congas, djembe, tabla, steel drum, maracas, castanets, kazoo, didgeridoo, bass guitar, electric guitar, acoustic guitar, cornet, euphonium, flugelhorn, lute, lyre, zither, dulcimer, balalaika, koto, shamisen, erhu, panpipes, ocarina, theremin, cajon, timpani, snare drum, harpsichord, clavichord, melodica",
    bias: { piano: 1.8, guitar: 1.8, drums: 1.5, triangle: 0.1, recorder: 0.15, organ: 0.1, keyboard: 0.2 },
  },
  {
    id: "board-game",
    text: "Name a board game",
    answers:
      "monopoly, scrabble, cluedo|clue, risk, chess, draughts|checkers, backgammon, ludo, snakes and ladders, trivial pursuit, connect four, battleships, operation, guess who, pictionary, articulate, mousetrap, buckaroo, kerplunk, jenga, twister, hungry hippos, catan|settlers of catan, ticket to ride, carcassonne, pandemic, azul, wingspan, dixit, codenames, cranium, balderdash, othello|reversi, mancala, go, shogi, mahjong, dominoes, yahtzee, boggle, upwords, rummikub, sequence, sorry, trouble, game of life, candy land, chutes and ladders, stratego, axis and allies, diplomacy, scythe, gloomhaven, terraforming mars, betrayal at house on the hill, camel up, splendor, king of tokyo, exploding kittens, uno, cards against humanity, trapdoor, frustration",
    bias: { monopoly: 2, scrabble: 1.8, chess: 1.6, risk: 0.2, operation: 0.05, sorry: 0.02, trouble: 0.02, go: 0.01, life: 0.05 },
  },
  {
    id: "superhero",
    text: "Name a superhero",
    answers:
      "superman, batman, spiderman|spider man, iron man, hulk, thor, captain america, black widow, hawkeye, wonder woman, flash, aquaman, green lantern, cyborg, robin, batgirl, supergirl, wolverine, storm, cyclops, professor x, jean grey, rogue, gambit, beast, nightcrawler, deadpool, black panther, doctor strange, ant man, wasp, captain marvel, ms marvel, scarlet witch, vision, falcon, winter soldier, star lord, gamora, drax, rocket raccoon, groot, nick fury, daredevil, punisher, ghost rider, blade, silver surfer, mister fantastic, invisible woman, human torch, the thing, green arrow, martian manhunter, shazam, hellboy, spawn, watchmen, dr manhattan, rorschach, moon knight, she hulk, hawkgirl, plastic man, elastigirl, mr incredible, dash, violet, frozone",
    bias: { superman: 2, batman: 2, flash: 0.1, robin: 0.1, vision: 0.02, beast: 0.05, storm: 0.03, blade: 0.1, rogue: 0.1 },
  },
  {
    id: "music-genre",
    text: "Name a genre of music",
    answers:
      "rock, pop, jazz, blues, classical, country, folk, hip hop, rap, r and b, soul, funk, disco, reggae, ska, punk, metal, heavy metal, death metal, black metal, grunge, indie, alternative, electronic, techno, house, trance, drum and bass, dubstep, garage, ambient, gospel, opera, swing, bebop, ragtime, bluegrass, americana, latin, salsa, samba, bossa nova, tango, flamenco, afrobeat, k pop, j pop, emo, hardcore, industrial, synthwave, lo fi, trap, grime, dancehall, calypso, zydeco, motown, britpop, new wave, psychedelic, progressive rock, hard rock, soft rock, glam rock, rockabilly, doo wop, a cappella, choral, chamber music, baroque, romantic, minimalism, world music, reggaeton, bachata, merengue, cumbia, highlife, soca",
    bias: { rock: 0.4, pop: 0.4, house: 0.02, garage: 0.05, soul: 0.1, country: 0.2, folk: 0.3, trap: 0.05 },
  },
  {
    id: "shakespeare-play",
    text: "Name a Shakespeare play",
    answers:
      "hamlet, macbeth, romeo and juliet, othello, king lear, julius caesar, the tempest, a midsummer nights dream, much ado about nothing, twelfth night, as you like it, the merchant of venice, the taming of the shrew, the comedy of errors, love labours lost, all well that ends well, measure for measure, the winters tale, cymbeline, pericles, troilus and cressida, coriolanus, timon of athens, titus andronicus, antony and cleopatra, richard ii, richard iii, henry iv, henry v, henry vi, henry viii, king john, two gentlemen of verona, the merry wives of windsor",
    bias: { hamlet: 2, macbeth: 1.8, "romeo and juliet": 1.8 },
  },
  {
    id: "greek-god",
    text: "Name a Greek god or goddess",
    answers:
      "zeus, hera, poseidon, hades, athena, apollo, artemis, ares, aphrodite, hephaestus, hermes, demeter, dionysus, hestia, persephone, eros, hypnos, thanatos, nike, nemesis, iris, hebe, hecate, pan, helios, selene, eos, gaia, uranus, cronus, rhea, atlas, prometheus, oceanus, tethys, chaos, nyx, erebus, tartarus, asclepius, tyche, morpheus, charon, triton, amphitrite, hyperion, themis, mnemosyne, calliope, the muses, the fates",
    bias: { zeus: 2, apollo: 0.4, nike: 0.05, iris: 0.1, pan: 0.05, chaos: 0.05, atlas: 0.2, uranus: 0.4 },
  },
  {
    id: "dance",
    text: "Name a style of dance",
    answers:
      "ballet, tap, jazz dance, contemporary, modern dance, hip hop, breakdancing, salsa, samba, tango, waltz, foxtrot, quickstep, cha cha, rumba, jive, paso doble, swing, lindy hop, charleston, ballroom, latin, flamenco, bellydancing, irish dancing, highland, morris dancing, line dancing, square dance, barn dance, disco, twist, macarena, moonwalk, krump, popping, locking, voguing, capoeira, bhangra, kathak, bharatanatyam, hula, haka, polka, mambo, merengue, bachata, zumba, pole dancing, burlesque, can can, minuet, bolero, conga, limbo, robot, floss",
    bias: { ballet: 2, tap: 0.1, twist: 0.05, swing: 0.1, robot: 0.05, limbo: 0.1 },
  },
  {
    id: "martial-art",
    text: "Name a martial art",
    answers:
      "karate, judo, taekwondo, kung fu, jiu jitsu, brazilian jiu jitsu, aikido, boxing, kickboxing, muay thai, wrestling, sumo, capoeira, krav maga, wing chun, tai chi, hapkido, sambo, savate, silat, escrima, kendo, kenjutsu, iaido, ninjutsu, shaolin, jeet kune do, mma, pankration, bartitsu, systema, lethwei, sanda, kalaripayattu, kyokushin, shotokan, aikijutsu, luta livre, catch wrestling, glima, bokator",
    bias: { karate: 2, judo: 1.5, boxing: 0.6 },
  },
]
