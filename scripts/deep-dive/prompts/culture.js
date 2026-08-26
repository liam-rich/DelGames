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
  {
    id: "film-genre",
    text: "Name a film genre",
    answers:
      "action, adventure, comedy, drama, horror, thriller, romance, romantic comedy|rom com, science fiction|sci fi, fantasy, animation, documentary, western, war, crime, mystery, noir, film noir, musical, biopic, historical, period drama, superhero, disaster, heist, spy, martial arts, slasher, zombie, vampire, ghost story, psychological thriller, courtroom drama, coming of age, road movie, buddy comedy, black comedy, satire, parody, mockumentary, silent film, epic, sports film, family, children, anime, stop motion, experimental, arthouse, cult, found footage, monster movie, creature feature, space opera, dystopian, post apocalyptic, gangster, samurai, spaghetti western, screwball comedy, melodrama, tearjerker, whodunnit",
    bias: { comedy: 1.5, horror: 1.5, action: 1.4 },
  },
  {
    id: "disney-film",
    text: "Name a Disney or Pixar film",
    answers:
      "the lion king, frozen, moana, tangled, brave, mulan, aladdin, beauty and the beast, cinderella, snow white, sleeping beauty, the little mermaid, pocahontas, hercules, tarzan, the jungle book, bambi, dumbo, pinocchio, peter pan, alice in wonderland, lady and the tramp, one hundred and one dalmatians, the aristocats, robin hood, the fox and the hound, the sword in the stone, oliver and company, the rescuers, the great mouse detective, the hunchback of notre dame, atlantis, treasure planet, lilo and stitch, brother bear, home on the range, chicken little, bolt, the princess and the frog, winnie the pooh, wreck it ralph, big hero six, zootopia, encanto, raya, luca, turning red, soul, coco, inside out, up, wall e, ratatouille, finding nemo, finding dory, monsters inc, monsters university, toy story, cars, the incredibles, a bugs life, brave, onward, elemental, lightyear, the good dinosaur, fantasia, the emperors new groove, meet the robinsons, tinker bell, planes, frozen two",
    bias: { "the lion king": 1.6, frozen: 1.5, "toy story": 1.4 },
  },
  {
    id: "tv-show",
    text: "Name a TV show",
    answers:
      "friends, the office, breaking bad, game of thrones, stranger things, the simpsons, family guy, south park, futurama, rick and morty, bobs burgers, king of the hill, the sopranos, the wire, mad men, better call saul, sherlock, doctor who, black mirror, peaky blinders, downton abbey, the crown, line of duty, luther, broadchurch, happy valley, killing eve, fleabag, after life, the it crowd, peep show, blackadder, fawlty towers, only fools and horses, the inbetweeners, gavin and stacey, mrs browns boys, dads army, porridge, one foot in the grave, keeping up appearances, the vicar of dibley, taskmaster, qi, mock the week, have i got news for you, would i lie to you, strictly come dancing, bake off, masterchef, the apprentice, dragons den, big brother, love island, im a celebrity, the chase, pointless, countdown, eggheads, university challenge, mastermind, coronation street, eastenders, emmerdale, hollyoaks, neighbours, home and away, casualty, holby city, silent witness, midsomer murders, poirot, marple, morse, endeavour, lewis, vera, shetland, the walking dead, lost, prison break, dexter, house, greys anatomy, scrubs, er, seinfeld, cheers, frasier, how i met your mother, the big bang theory, brooklyn nine nine, parks and recreation, community, arrested development, curb your enthusiasm, veep, succession, ted lasso, the last of us, the mandalorian, the boys, squid game, money heist, dark, narcos, ozark, mindhunter, the queens gambit, bridgerton, wednesday, severance",
    bias: { friends: 1.5, "the simpsons": 1.4 },
  },
  {
    id: "cartoon-character",
    text: "Name a cartoon character",
    answers:
      "mickey mouse, minnie mouse, donald duck, goofy, pluto, bugs bunny, daffy duck, porky pig, elmer fudd, tweety, sylvester, road runner, wile e coyote, tom, jerry, scooby doo, shaggy, velma, fred, daphne, homer simpson, marge simpson, bart simpson, lisa simpson, maggie simpson, mr burns, ned flanders, peter griffin, stewie, brian, meg, chris, lois, cartman, kenny, stan, kyle, spongebob, patrick, squidward, mr krabs, plankton, sandy, popeye, olive oyl, betty boop, fred flintstone, barney rubble, wilma, george jetson, yogi bear, boo boo, top cat, huckleberry hound, snagglepuss, pink panther, inspector gadget, dexter, johnny bravo, courage the cowardly dog, ed edd n eddy, powerpuff girls, samurai jack, avatar aang, ben ten, phineas, ferb, perry the platypus, kim possible, danny phantom, timmy turner, arnold, doug, rugrats, tommy pickles, chuckie, angelica, rocko, ren, stimpy, beavis, butthead, daria, bob the builder, postman pat, fireman sam, peppa pig, paw patrol, thomas the tank engine, wallace, gromit, shaun the sheep, danger mouse, count duckula, dangermouse, the mr men, paddington, winnie the pooh, tigger, eeyore, piglet, pikachu, ash ketchum, goku, naruto, doraemon, hello kitty, totoro, asterix, obelix, tintin, snowy, garfield, odie, snoopy, charlie brown, woodstock, linus, lucy",
    bias: { "mickey mouse": 1.5, "bugs bunny": 1.3, spongebob: 1.3 },
  },
  {
    id: "video-game",
    text: "Name a video game",
    answers:
      "minecraft, fortnite, roblox, call of duty, grand theft auto, red dead redemption, the last of us, god of war, uncharted, halo, gears of war, doom, quake, wolfenstein, half life, portal, counter strike, valorant, overwatch, apex legends, pubg, rainbow six, battlefield, far cry, assassins creed, watch dogs, the witcher, cyberpunk, skyrim, oblivion, morrowind, fallout, mass effect, dragon age, baldurs gate, diablo, world of warcraft, starcraft, warcraft, hearthstone, league of legends, dota, super mario, mario kart, super smash bros, zelda, breath of the wild, metroid, donkey kong, kirby, star fox, animal crossing, splatoon, pokemon, pikmin, luigis mansion, sonic, crash bandicoot, spyro, ratchet and clank, tekken, street fighter, mortal kombat, soul calibur, fifa, pes, madden, nba two k, rocket league, gran turismo, forza, need for speed, burnout, tomb raider, resident evil, silent hill, dead space, bloodborne, dark souls, elden ring, sekiro, nioh, monster hunter, final fantasy, kingdom hearts, persona, chrono trigger, undertale, stardew valley, terraria, hollow knight, celeste, cuphead, hades, among us, fall guys, the sims, sim city, civilization, age of empires, command and conquer, total war, xcom, tetris, pac man, space invaders, pong, asteroids, centipede, frogger, galaga, candy crush, angry birds, temple run, subway surfers, clash of clans, pokemon go",
    bias: { minecraft: 1.5, fortnite: 1.4 },
  },
  {
    id: "band-artist",
    text: "Name a band or music artist",
    answers:
      "the beatles, the rolling stones, queen, led zeppelin, pink floyd, the who, the doors, nirvana, oasis, blur, radiohead, coldplay, muse, the killers, arctic monkeys, the strokes, the smiths, joy division, new order, depeche mode, u two, r e m, the cure, the clash, sex pistols, ramones, the police, dire straits, fleetwood mac, eagles, ac dc, guns n roses, metallica, iron maiden, black sabbath, deep purple, aerosmith, bon jovi, def leppard, kiss, rush, genesis, yes, the beach boys, abba, bee gees, earth wind and fire, the jackson five, michael jackson, prince, madonna, whitney houston, mariah carey, celine dion, elton john, david bowie, freddie mercury, george michael, wham, spice girls, take that, backstreet boys, one direction, westlife, boyzone, adele, amy winehouse, ed sheeran, sam smith, dua lipa, harry styles, taylor swift, beyonce, rihanna, lady gaga, katy perry, ariana grande, billie eilish, olivia rodrigo, bruno mars, justin bieber, justin timberlake, the weeknd, drake, kanye west, jay z, eminem, kendrick lamar, tupac, biggie, snoop dogg, dr dre, nas, fifty cent, stormzy, dave, bob marley, bob dylan, johnny cash, elvis presley, buddy holly, chuck berry, jimi hendrix, janis joplin, stevie wonder, aretha franklin, ray charles, marvin gaye, otis redding, james brown, frank sinatra, dean martin, tony bennett, nat king cole, ella fitzgerald, louis armstrong, miles davis, john coltrane, daft punk, the prodigy, chemical brothers, massive attack, portishead, gorillaz, tame impala, foo fighters, red hot chili peppers, green day, blink one eighty two, weezer, the white stripes, jack white, kings of leon, florence and the machine, mumford and sons, the lumineers",
    bias: { "the beatles": 1.5, queen: 1.3 },
  },
  {
    id: "musical",
    text: "Name a musical",
    answers:
      "hamilton, wicked, les miserables, the phantom of the opera, cats, chicago, grease, mamma mia, the lion king, mary poppins, matilda, the book of mormon, dear evan hansen, six, hadestown, come from away, waitress, kinky boots, billy elliot, blood brothers, the sound of music, west side story, oklahoma, carousel, south pacific, the king and i, my fair lady, guys and dolls, fiddler on the roof, hello dolly, funny girl, cabaret, a chorus line, evita, jesus christ superstar, joseph, starlight express, sunset boulevard, school of rock, aspects of love, rent, avenue q, spring awakening, in the heights, the greatest showman, la la land, singin in the rain, an american in paris, forty second street, anything goes, kiss me kate, the producers, spamalot, legally blonde, hairspray, thoroughly modern millie, sister act, dreamgirls, jersey boys, we will rock you, rock of ages, bat out of hell, tina, beautiful, jagged little pill, moulin rouge, frozen, aladdin, beauty and the beast, newsies, anastasia, bring it on, heathers, mean girls, the addams family, little shop of horrors, sweeney todd, into the woods, sunday in the park with george, company, follies, a little night music, pippin, godspell, annie, oliver, the wizard of oz",
    bias: { hamilton: 1.4, wicked: 1.3, "les miserables": 1.3 },
  },
  {
    id: "author",
    text: "Name an author",
    answers:
      "shakespeare, charles dickens, jane austen, the brontes, charlotte bronte, emily bronte, thomas hardy, george eliot, virginia woolf, james joyce, oscar wilde, mark twain, ernest hemingway, f scott fitzgerald, john steinbeck, william faulkner, harper lee, toni morrison, maya angelou, kurt vonnegut, joseph heller, jack kerouac, j d salinger, george orwell, aldous huxley, ray bradbury, isaac asimov, arthur c clarke, philip k dick, ursula le guin, william gibson, neil gaiman, terry pratchett, douglas adams, j r r tolkien, c s lewis, j k rowling, philip pullman, roald dahl, enid blyton, beatrix potter, dr seuss, aa milne|milne|a a milne, lewis carroll, kenneth grahame, robert louis stevenson, jules verne, h g wells, bram stoker, mary shelley, edgar allan poe, arthur conan doyle, agatha christie, ian fleming, john le carre, len deighton, stephen king, dean koontz, james patterson, john grisham, dan brown, lee child, ian rankin, val mcdermid, ruth rendell, p d james, gillian flynn, paula hawkins, sally rooney, zadie smith, salman rushdie, kazuo ishiguro, ian mcewan, julian barnes, martin amis, hilary mantel, margaret atwood, alice munro, gabriel garcia marquez, jorge luis borges, isabel allende, paulo coelho, haruki murakami, leo tolstoy, fyodor dostoevsky, anton chekhov, vladimir nabokov, franz kafka, albert camus, jean paul sartre, victor hugo, alexandre dumas, gustave flaubert, marcel proust, umberto eco, italo calvino, homer, virgil, dante, chaucer, milton, wordsworth, keats, byron, shelley, tennyson, t s eliot, sylvia plath, emily dickinson, walt whitman, robert frost, seamus heaney",
    bias: { shakespeare: 1.5, "charles dickens": 1.3 },
  },
  {
    id: "mythical-creature",
    text: "Name a mythical creature",
    answers:
      "dragon, unicorn, phoenix, griffin, centaur, minotaur, pegasus, mermaid, siren, harpy, sphinx, hydra, cerberus, chimera, cyclops, kraken, leviathan, basilisk, cockatrice, wyvern, troll, ogre, goblin, orc, elf, dwarf, fairy, pixie, sprite, nymph, dryad, satyr, faun, imp, gnome, leprechaun, banshee, ghost, poltergeist, vampire, werewolf, zombie, mummy, golem, gargoyle, yeti, bigfoot, sasquatch, loch ness monster, chupacabra, wendigo, kelpie, selkie, changeling, will o the wisp, jackalope, thunderbird, roc, simurgh, qilin, kirin, kappa, tengu, oni, yokai, jorogumo, naga, garuda, rakshasa, djinn|genie, ifrit, ghoul, lamia, gorgon, medusa, echidna, typhon, titan, giant, ent, balrog, hippogriff, manticore, salamander, sea serpent, hobgoblin, brownie, boggart, redcap, nuckelavee, bunyip, drop bear, mothman, jersey devil",
    bias: { dragon: 1.8, unicorn: 1.5, mermaid: 1.3 },
  },
  {
    id: "painter-artist",
    text: "Name a painter or artist",
    answers:
      "picasso, van gogh, monet, manet, renoir, degas, cezanne, matisse, gauguin, toulouse lautrec, seurat, pissarro, sisley, rodin, dali, magritte, miro, kandinsky, klee, mondrian, pollock, rothko, warhol, lichtenstein, basquiat, hockney, bacon, freud, banksy, damien hirst, tracey emin, henry moore, barbara hepworth, anish kapoor, yayoi kusama, ai weiwei, leonardo da vinci, michelangelo, raphael, donatello, botticelli, titian, caravaggio, rembrandt, vermeer, rubens, van dyck, velazquez, goya, el greco, bosch, bruegel, durer, holbein, turner, constable, gainsborough, reynolds, hogarth, blake, millais, rossetti, burne jones, whistler, sargent, hopper, o keeffe, frida kahlo, diego rivera, munch, klimt, schiele, chagall, modigliani, giacometti, calder, duchamp, man ray, escher, vasarely, riley, caulfield, auerbach, riley, gormley, emin, whiteread, kahlo",
    bias: { picasso: 1.5, "van gogh": 1.5 },
  },
  {
    id: "fairy-tale",
    text: "Name a fairy tale or nursery rhyme",
    answers:
      "cinderella, snow white, sleeping beauty, rapunzel, hansel and gretel, little red riding hood, goldilocks, the three little pigs, jack and the beanstalk, the gingerbread man, the ugly duckling, the little mermaid, thumbelina, the emperors new clothes, the princess and the pea, the frog prince, beauty and the beast, rumpelstiltskin, the pied piper, puss in boots, the elves and the shoemaker, the twelve dancing princesses, the six swans, the wild swans, bluebeard, the snow queen, the steadfast tin soldier, the little match girl, chicken licken, the boy who cried wolf, the tortoise and the hare, the town mouse and the country mouse, the fox and the grapes, the ants and the grasshopper, the lion and the mouse, humpty dumpty, jack and jill, little miss muffet, mary had a little lamb, baa baa black sheep, twinkle twinkle little star, hickory dickory dock, hey diddle diddle, the grand old duke of york, London bridge is falling down, ring a ring o roses, incy wincy spider, old macdonald, this little piggy, wheels on the bus, row row row your boat, three blind mice, sing a song of sixpence, pat a cake, polly put the kettle on, oranges and lemons, pop goes the weasel, georgie porgie, wee willie winkie, little bo peep, little jack horner, old mother hubbard, there was an old woman",
    bias: { cinderella: 1.5, "snow white": 1.4 },
  },
  {
    id: "card-game",
    text: "Name a card game",
    answers:
      "poker, texas holdem, blackjack, pontoon, rummy, gin rummy, bridge, whist, canasta, cribbage, solitaire, patience, spider solitaire, freecell, snap, go fish, old maid, cheat, bullshit, uno, sevens, newmarket, chase the ace, beggar my neighbour, war, slapjack, spit, speed, hearts, spades, euchre, pinochle, piquet, bezique, skat, sheepshead, tarot, baccarat, chemin de fer, punto banco, casino, faro, three card brag, brag, red dog, in between, pai gow, big two, president, scum, mao, egyptian ratscrew, cribbage, kalooki, mahjong, pyramid, klondike, yukon, golf, crazy eights, switch, black maria, oh hell, nomination whist, contract whist, knockout whist, racing demon, dobble, exploding kittens, cards against humanity, magic the gathering, pokemon, yugioh, hearthstone, munchkin, sushi go, love letter, coup, the mind, skull",
    bias: { poker: 1.6, blackjack: 1.4, uno: 1.3 },
  },
]
