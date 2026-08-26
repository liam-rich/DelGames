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
  {
    id: "colour",
    text: "Name a colour",
    answers:
      "red, blue, green, yellow, orange, purple, pink, black, white, grey|gray, brown, beige, cream, ivory, gold, silver, bronze, copper, turquoise, teal, cyan, aqua, navy, royal blue, sky blue, baby blue, cobalt, indigo, violet, lilac, lavender, mauve, magenta, fuchsia, crimson, scarlet, ruby, maroon, burgundy, wine, rust, terracotta, coral, salmon, peach, apricot, amber, mustard, ochre, khaki, olive, lime, mint, emerald, jade, forest green, sage, moss, chartreuse, tan, taupe, sand, camel, chocolate, coffee, charcoal, slate, jet, ebony, snow, pearl, champagne, blush, rose, plum, aubergine, periwinkle, cerulean, ultramarine, vermilion, sepia, umber, sienna, saffron, canary, lemon, buttercup, flesh, nude, off white, eggshell",
    bias: { red: 1.6, blue: 1.8, green: 1.5, orange: 0.6, violet: 0.3, rose: 0.3, jet: 0.1 },
  },
  {
    id: "body-part",
    text: "Name a part of the body",
    answers:
      "head, face, eye, ear, nose, mouth, lip, tongue, tooth, chin, cheek, forehead, eyebrow, eyelash, jaw, neck, throat, shoulder, arm, elbow, wrist, hand, finger, thumb, nail, knuckle, palm, chest, breast, rib, back, spine, stomach, belly, waist, hip, bottom, leg, thigh, knee, shin, calf, ankle, foot, toe, heel, sole, arch, skin, hair, scalp, brain, heart, lung, liver, kidney, spleen, pancreas, gallbladder, bladder, intestine, colon, appendix, oesophagus, windpipe, diaphragm, muscle, bone, skull, collarbone, femur, tibia, fibula, humerus, radius, ulna, pelvis, sternum, vertebra, tendon, ligament, cartilage, artery, vein, nerve, joint, eardrum, retina, cornea, iris, pupil, tonsil, thyroid, gum, jawbone, kneecap, shoulder blade, hamstring, bicep, tricep, abs, glutes, achilles",
    bias: { head: 1.4, arm: 1.4, leg: 1.4, hand: 1.4, eye: 1.3 },
  },
  {
    id: "shoe",
    text: "Name a type of shoe",
    answers:
      "trainers|sneakers, boots, sandals, flip flops, slippers, heels, high heels, stilettos, wedges, pumps, ballet flats, loafers, brogues, oxfords, derbies, moccasins, boat shoes, deck shoes, espadrilles, mules, clogs, crocs, wellies|wellington boots, walking boots, hiking boots, football boots, running shoes, trail shoes, plimsolls, converse, vans, doc martens, chelsea boots, ankle boots, knee high boots, thigh high boots, cowboy boots, ugg boots, snow boots, ski boots, riding boots, work boots, steel toe caps, court shoes, kitten heels, platforms, sliders, gladiator sandals, jelly shoes, school shoes, dress shoes, tap shoes, ballet shoes, pointe shoes, football cleats, golf shoes, cycling shoes, climbing shoes, water shoes, jandals, geta, sabot",
    bias: { trainers: 1.6, boots: 1.5, sandals: 1.4 },
  },
  {
    id: "jewellery",
    text: "Name a piece of jewellery or accessory",
    answers:
      "ring, necklace, bracelet, earrings, watch, brooch, pendant, chain, choker, anklet, cufflinks, tiara, crown, locket, charm bracelet, bangle, signet ring, engagement ring, wedding ring, eternity ring, studs, hoops, drop earrings, clip ons, nose ring, nose stud, belly bar, tongue bar, septum ring, ear cuff, hair clip, hair band, scrunchie, hair slide, tiara, hat, cap, scarf, gloves, belt, braces, tie, bow tie, cravat, pocket square, handbag, purse, wallet, clutch, tote, backpack, satchel, sunglasses, glasses, monocle, umbrella, walking stick, cane, fan, muff, shawl, pashmina, badge, pin, lapel pin, medal, dog tag, friendship bracelet, beads, pearls, cameo, amulet, talisman",
    bias: { ring: 1.6, necklace: 1.5, watch: 1.3 },
  },
  {
    id: "bedroom-item",
    text: "Name something you'd find in a bedroom",
    answers:
      "bed, mattress, pillow, duvet, quilt, blanket, sheet, bedspread, headboard, wardrobe, chest of drawers, bedside table, lamp, bedside lamp, alarm clock, mirror, dressing table, curtains, blinds, rug, carpet, poster, picture, photo frame, bookshelf, books, desk, chair, laundry basket, hamper, slippers, dressing gown, pyjamas, hangers, shoe rack, jewellery box, tissues, water glass, phone charger, radiator, window, door, light switch, ceiling light, fairy lights, candle, diffuser, teddy bear, cushions, throw, ottoman, blanket box, tv, radio, hairdryer, fan, humidifier, plant, bin, wallpaper, socket, plug, chest, trunk, vanity, stool, full length mirror, drawer, cupboard",
    bias: { bed: 2, wardrobe: 1.4, pillow: 1.3 },
  },
  {
    id: "car-item",
    text: "Name a part of a car",
    answers:
      "steering wheel, wheel, tyre, engine, bonnet|hood, boot|trunk, door, window, windscreen|windshield, wiper, mirror, wing mirror, rear view mirror, headlight, tail light, indicator, brake light, fog light, bumper, wing, bodywork, roof, sunroof, aerial, seat, driver seat, passenger seat, back seat, seatbelt, airbag, dashboard, speedometer, rev counter, fuel gauge, odometer, glovebox, handbrake, gearstick, gearbox, clutch, brake, accelerator, pedal, ignition, key, radio, stereo, air conditioning, heater, vent, horn, exhaust, catalytic converter, silencer, radiator, battery, alternator, spark plug, piston, cylinder, camshaft, crankshaft, carburettor, fuel tank, fuel cap, oil filter, air filter, suspension, shock absorber, axle, differential, driveshaft, chassis, hubcap, alloy, spare tyre, jack, number plate, wiper blade, sun visor, headrest, cup holder, gear lever, clutch pedal",
    bias: { "steering wheel": 1.6, engine: 1.5, wheel: 1.4 },
  },
  {
    id: "office-item",
    text: "Name something you'd find in an office",
    answers:
      "desk, chair, computer, laptop, monitor, keyboard, mouse, printer, scanner, photocopier, phone, telephone, headset, pen, pencil, biro, marker, highlighter, rubber|eraser, ruler, stapler, staples, paperclip, bulldog clip, hole punch, scissors, sellotape, glue, notepad, notebook, post it, diary, calendar, folder, ring binder, file, filing cabinet, in tray, out tray, drawer, shelf, whiteboard, flipchart, projector, screen, cable, charger, plug, extension lead, lamp, desk lamp, bin, shredder, water cooler, kettle, coffee machine, mug, plant, clock, noticeboard, poster, name badge, lanyard, id card, swipe card, meeting room, boardroom, reception, lift, stairs, fire extinguisher, first aid kit, coat rack, locker, envelope, stamp, letterhead, business card, calculator, laminator, guillotine",
    bias: { desk: 1.8, computer: 1.6, chair: 1.4 },
  },
  {
    id: "beach-item",
    text: "Name something you'd find at the beach",
    answers:
      "sand, sea, waves, shells, pebbles, rocks, rock pool, seaweed, driftwood, towel, deckchair, sun lounger, parasol, umbrella, windbreak, sunglasses, suncream|sunscreen, hat, swimsuit, bikini, trunks, flip flops, bucket, spade, sandcastle, beach ball, frisbee, kite, surfboard, bodyboard, paddleboard, kayak, lilo, armbands, rubber ring, snorkel, mask, flippers, wetsuit, cool box, picnic, ice cream, chips, fish and chips, doughnut, seagull, crab, starfish, jellyfish, sand dune, cliff, pier, promenade, lighthouse, harbour, boat, lifeguard, lifebuoy, flag, litter bin, footprints, driftwood, message in a bottle, metal detector, beach hut, changing room, shower, sunbed, hammock, palm tree, tide, rockpool, barnacle, limpet, sand dollar, coral",
    bias: { sand: 1.8, sea: 1.6, shells: 1.4 },
  },
  {
    id: "household-chore",
    text: "Name a household chore",
    answers:
      "hoovering|vacuuming, dusting, mopping, sweeping, washing up, loading the dishwasher, emptying the dishwasher, laundry, washing, drying, ironing, folding, putting clothes away, changing the bed, making the bed, cleaning the bathroom, scrubbing the toilet, cleaning the oven, wiping surfaces, cleaning windows, taking out the bins, recycling, tidying, decluttering, polishing, vacuuming the stairs, mowing the lawn, weeding, watering plants, raking leaves, washing the car, walking the dog, feeding the pets, cleaning the litter tray, food shopping, cooking, meal prep, defrosting the freezer, descaling the kettle, changing lightbulbs, unblocking the sink, painting, decorating, hanging pictures, assembling furniture, sorting post, paying bills, hoovering the car, cleaning the fridge, scrubbing the shower, bleaching, degreasing, sanitising",
    bias: { hoovering: 1.5, "washing up": 1.5, ironing: 1.3 },
  },
  {
    id: "emotion",
    text: "Name an emotion or feeling",
    answers:
      "happy, sad, angry, scared, excited, nervous, anxious, worried, calm, relaxed, content, joyful, cheerful, delighted, elated, ecstatic, proud, grateful, hopeful, optimistic, loving, affectionate, tender, sympathetic, empathetic, compassionate, lonely, homesick, nostalgic, wistful, melancholy, gloomy, miserable, depressed, despairing, grieving, heartbroken, disappointed, frustrated, irritated, annoyed, furious, enraged, resentful, bitter, jealous, envious, guilty, ashamed, embarrassed, humiliated, awkward, shy, insecure, vulnerable, confused, overwhelmed, stressed, exhausted, bored, restless, impatient, curious, surprised, shocked, amazed, awestruck, confident, determined, motivated, inspired, relieved, safe, secure, amused, playful, mischievous, smug, indifferent, numb, apathetic, disgusted, contempt, suspicious, paranoid, hysterical, giddy, sentimental",
    bias: { happy: 1.8, sad: 1.7, angry: 1.5 },
  },
  {
    id: "unit-of-measurement",
    text: "Name a unit of measurement",
    answers:
      "metre|meter, centimetre, millimetre, kilometre, inch, foot, yard, mile, nautical mile, league, furlong, chain, rod, hand, fathom, gram, kilogram, milligram, tonne, ton, ounce, pound, stone, hundredweight, carat, litre|liter, millilitre, centilitre, pint, quart, gallon, fluid ounce, cup, tablespoon, teaspoon, barrel, bushel, peck, second, minute, hour, day, week, month, year, decade, century, millennium, fortnight, celsius, fahrenheit, kelvin, degree, radian, hertz, watt, kilowatt, joule, calorie, newton, pascal, bar, atmosphere, volt, amp, ohm, coulomb, farad, henry, tesla, weber, lumen, lux, candela, mole, byte, kilobyte, megabyte, gigabyte, terabyte, bit, pixel, knot, horsepower, decibel, richter, light year, parsec, astronomical unit, acre, hectare, square metre, cubic metre, karat, denier, thread count",
    bias: { metre: 1.5, kilogram: 1.3, mile: 1.3 },
  },
]
