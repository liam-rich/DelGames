// Curated prompt bank — everyday objects and life.

export default [
  {
    id: "kitchen-item",
    text: "Name something you'd find in a kitchen",
    answers:
      "fridge|refrigerator, oven, cooker|stove, microwave, kettle, toaster, sink, tap, dishwasher, freezer, blender, food processor, mixer, kitchen scales, chopping board, knife, fork, spoon, plate, bowl, mug, cup, glass, saucepan, frying pan, wok, casserole dish, baking tray, colander, sieve, whisk, spatula, ladle, grater, peeler, tin opener|can opener, corkscrew, rolling pin, oven glove, tea towel, apron, bin, cupboard, drawer, worktop|counter, shelf, spice rack, cookbook, timer, thermometer, cafetiere, coffee machine, teapot, breadbin, toast rack, salt, pepper, sugar, flour, olive oil, washing up liquid, sponge, kitchen roll, cling film, tin foil, tupperware, cutlery, cheese board, garlic press, masher, tongs, skewer, ramekin, mandolin, pestle and mortar",
    bias: { sink: 1.4, fridge: 1.8, oven: 1.6, knife: 1.3, table: 0.3, chair: 0.2 },
  },
  {
    id: "bathroom-item",
    text: "Name something you'd find in a bathroom",
    answers:
      "toilet, sink, bath|bathtub, shower, mirror, towel, toothbrush, toothpaste, soap, shampoo, conditioner, shower gel, razor, shaving foam, deodorant, hairbrush, comb, hairdryer, toilet roll|toilet paper|loo roll|bog roll, toilet brush, bin, bath mat, shower curtain, cabinet, medicine cabinet, scales, flannel, sponge, loofah, bath bomb, bubble bath, moisturiser, cotton buds, cotton wool, tweezers, nail clippers, nail file, floss, mouthwash, plaster, first aid kit, tap, plug, drain, radiator, towel rail, air freshener, candle, toothbrush holder, soap dish, laundry basket, rubber duck, tiles, extractor fan, light switch, window, plunger, bleach, disinfectant, makeup, perfume, aftershave, contact lenses",
    bias: { toilet: 2, sink: 1.5, mirror: 1.3, towel: 1.5, window: 0.2, bin: 0.5 },
  },
  {
    id: "furniture",
    text: "Name a piece of furniture",
    answers:
      "chair, table, sofa|couch, bed, wardrobe, chest of drawers, bookcase, desk, stool, bench, armchair, coffee table, dining table, side table, bedside table|nightstand, dresser, cabinet, sideboard, cupboard, shelf, shelving unit, tv stand, ottoman, footstool, pouffe, chaise longue, recliner, rocking chair, high chair, bunk bed, sofa bed, futon, cot, crib, mattress, headboard, mirror, coat rack, hat stand, umbrella stand, filing cabinet, wine rack, display cabinet, chest, trunk, dressing table, vanity, console table, nest of tables, drop leaf table, welsh dresser, four poster bed, day bed, chesterfield, beanbag, hammock, deckchair, sun lounger, picnic table, wardrobe, blanket box",
    bias: { chair: 1.8, table: 1.8, bed: 1.6, sofa: 1.6, mirror: 0.3, shelf: 0.4 },
  },
  {
    id: "clothing",
    text: "Name an item of clothing",
    answers:
      "shirt, t shirt, trousers|pants, jeans, shorts, skirt, dress, jumper|sweater, hoodie, cardigan, jacket, coat, blazer, suit, tie, bow tie, scarf, gloves, hat, cap, beanie, socks, shoes, boots, trainers|sneakers, sandals, flip flops, slippers, heels, underwear, boxers, briefs, bra, vest, tights, leggings, stockings, pyjamas, dressing gown, onesie, swimsuit, bikini, trunks, wetsuit, waistcoat, poncho, cape, kimono, sari, kilt, dungarees, overalls, jumpsuit, romper, blouse, top, tank top, crop top, polo shirt, sweatshirt, tracksuit|trackies, anorak, parka, raincoat, gilet, cummerbund, cravat, belt, braces, apron, uniform, gown, robe, shawl, mittens, earmuffs, balaclava, headband",
    bias: { shirt: 1.5, hat: 0.6, top: 0.05, pants: 0.3, vest: 0.4, cap: 0.2, belt: 0.3, gown: 0.2, robe: 0.2 },
  },
  {
    id: "job",
    text: "Name a job",
    answers:
      "teacher, doctor, nurse, lawyer, engineer, accountant, plumber, electrician, builder, carpenter, mechanic, chef, waiter, barista, cleaner, driver, taxi driver, bus driver, pilot, flight attendant, police officer, firefighter, paramedic, soldier, sailor, farmer, fisherman, butcher, baker, hairdresser, barber, beautician, dentist, vet, pharmacist, optician, surgeon, therapist, psychologist, social worker, journalist, writer, author, editor, photographer, artist, musician, actor, dancer, singer, comedian, presenter, architect, designer, programmer, developer, scientist, researcher, professor, librarian, archaeologist, astronaut, banker, estate agent, receptionist, secretary, manager, salesperson, shopkeeper, postman, courier, refuse collector|bin man|binman, gardener, landscaper, painter, decorator, roofer, welder, blacksmith, tailor, seamstress, jeweller, watchmaker, florist, undertaker, priest, vicar, judge, barrister, solicitor, politician, diplomat, translator, interpreter, coach, referee, lifeguard, midwife, radiographer, physiotherapist, dietitian, miner, driller, roughneck, air traffic controller, train driver, conductor, pest controller, locksmith, glazier, plasterer, scaffolder, surveyor, auditor, actuary, statistician, economist",
    bias: { teacher: 1.8, doctor: 1.8, nurse: 1.5, manager: 0.3, driver: 0.3, cook: 0.2 },
  },
  {
    id: "transport",
    text: "Name a mode of transport",
    answers:
      "car, bus, train, bike|bicycle, motorbike|motorcycle, plane|aeroplane|airplane, boat, ship, ferry, tram, taxi, coach, lorry|truck, van, scooter, moped, helicopter, hot air balloon, hovercraft, submarine, canoe, kayak, rowing boat, sailing boat|yacht, jet ski, gondola, cable car, chairlift, funicular, monorail, underground|tube|subway, metro, rickshaw, tuk tuk, horse, donkey, camel, sledge|sled, sleigh, dog sled, skateboard, rollerblades, roller skates, segway, wheelchair, walking, running, hitchhiking, zeppelin, airship, glider, parachute, rocket, space shuttle, jetpack, chariot, carriage, stagecoach, cart, wheelbarrow, elevator|lift, escalator, ski lift, punt, raft, catamaran, hydrofoil, tandem, unicycle, quad bike, tractor, snowmobile",
    bias: { car: 2, bus: 1.6, train: 1.5, walking: 0.3, horse: 0.3, rocket: 0.3 },
  },
  {
    id: "tool",
    text: "Name a tool",
    answers:
      "hammer, screwdriver, spanner|wrench, pliers, saw, hacksaw, chisel, drill, sander, plane, file, rasp, axe, hatchet, crowbar, mallet, level|spirit level, tape measure, ruler, square, clamp, vice, wire cutters, snips, stanley knife|utility knife, scalpel, scissors, staple gun, nail gun, soldering iron, welder, angle grinder, jigsaw, circular saw, chainsaw, router, lathe, torch, workbench, toolbox, allen key, socket set, ratchet, screw, nail, bolt, washer, sandpaper, trowel, spade, shovel, fork, rake, hoe, secateurs, shears, pruning saw, wheelbarrow, ladder, stepladder, paintbrush, roller, scraper, putty knife, caulking gun, plunger, pipe cutter, blowtorch, multimeter, stud finder, chalk line, plumb bob, awl, bradawl, punch, tin snips, bolt cutters",
    bias: { hammer: 2, screwdriver: 1.8, saw: 0.3, plane: 0.02, file: 0.02, level: 0.1, square: 0.05, fork: 0.1, drill: 0.5, punch: 0.05 },
  },
  {
    id: "school-subject",
    text: "Name a school subject",
    answers:
      "maths|mathematics|math, english, science, history, geography, art, music, pe|physical education, biology, chemistry, physics, french, spanish, german, latin, drama, technology, design technology, computing, computer science, it, religious education|re, citizenship, psychology, sociology, economics, business studies, media studies, food technology, cooking, textiles, woodwork, metalwork, graphics, photography, dance, philosophy, politics, law, accounting, statistics, further maths, classics, ancient history, environmental science, health and social care, engineering, astronomy, geology, mandarin, italian, russian, welsh, literature, creative writing, general studies, life skills, pshe",
    bias: { maths: 2, english: 1.8, science: 1.6, art: 1.2, history: 1.4 },
  },
  {
    id: "weather",
    text: "Name a type of weather",
    answers:
      "rain, sun|sunshine, snow, wind, cloud|cloudy, fog, mist, hail, sleet, storm, thunder, lightning, thunderstorm, drizzle, shower, downpour, blizzard, hurricane, tornado, cyclone, typhoon, gale, breeze, frost, ice, freezing, heatwave, drought, flood, monsoon, humidity, muggy, overcast, clear, sunny, rainbow, dew, smog, haze, whirlwind, dust storm, sandstorm, squall, hoarfrost, black ice, sunny spells, scattered showers, sunny intervals, thundery, sultry, balmy, bitter, mild, warm, cold, hot, chilly, crisp",
    bias: { rain: 2, sun: 1.6, snow: 1.6, storm: 0.8, clear: 0.1, shower: 0.2, hot: 0.1, cold: 0.1 },
  },
]
