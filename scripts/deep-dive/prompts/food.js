// Curated prompt bank — food and drink.

export default [
  {
    id: "fruit",
    text: "Name a fruit",
    answers:
      "apple, banana, orange, strawberry, grape, pineapple, mango, watermelon, peach, pear, cherry, lemon, lime, kiwi|kiwi fruit, plum, blueberry, raspberry, blackberry, melon, cantaloupe, honeydew, papaya, apricot, nectarine, pomegranate, coconut, fig, date, guava, passion fruit, lychee, dragon fruit, persimmon|sharon fruit, cranberry, grapefruit, tangerine, clementine, mandarin, satsuma, avocado, rhubarb, gooseberry, plantain, star fruit|starfruit, jackfruit, durian, quince, damson, elderberry, mulberry, redcurrant, blackcurrant, ugli fruit, tamarind, kumquat, loquat, soursop, rambutan, physalis, boysenberry, greengage, sloe, medlar",
    bias: { date: 0.02, orange: 1.3, kiwi: 0.4, lime: 0.3, plum: 0.6, fig: 0.4, apple: 0.8, cherry: 0.6, mango: 1.2, avocado: 1.2 },
  },
  {
    id: "vegetable",
    text: "Name a vegetable",
    answers:
      "carrot, potato, broccoli, cauliflower, cabbage, lettuce, tomato, cucumber, onion, garlic, pepper, spinach, peas, beans, green beans, sweetcorn|corn|corn on the cob, courgette|zucchini, aubergine|eggplant, mushroom, celery, leek, parsnip, turnip, swede, beetroot|beet, radish, asparagus, artichoke, brussels sprouts|sprouts, kale, chard, rocket|arugula, watercress, pumpkin, squash, butternut squash, sweet potato, yam, okra, fennel, chicory, endive, pak choi|bok choy, mangetout, runner beans, broad beans, shallot, spring onion, samphire, kohlrabi, salsify, celeriac, horseradish, cassava, taro, edamame, romanesco",
    bias: { pepper: 0.3, corn: 0.4, squash: 0.2, beans: 0.5, carrot: 1.4, broccoli: 1.3 },
  },
  {
    id: "pizza-topping",
    text: "Name a pizza topping",
    answers:
      "pepperoni, cheese, mushroom, ham, pineapple, olives, onion, pepper, sausage, bacon, chicken, tomato, sweetcorn, spinach, anchovy, tuna, salami, chorizo, prawns, beef, meatball, jalapeno, chilli, garlic, basil, rocket, artichoke, aubergine, courgette, red onion, mozzarella, feta, goats cheese, parmesan, blue cheese, ricotta, pesto, egg, truffle, capers, sun dried tomatoes, spring onion, pastrami, prosciutto, pancetta, duck, halloumi, pulled pork, kebab meat, chips",
    bias: { pepperoni: 2.5, cheese: 1.5, mushroom: 1.4, pineapple: 1.6, ham: 1.3, pepper: 0.3, egg: 0.2, chicken: 0.5, beef: 0.4 },
  },
  {
    id: "cheese",
    text: "Name a cheese",
    answers:
      "cheddar, mozzarella, brie, camembert, parmesan, feta, gouda, edam, stilton, blue cheese, gorgonzola, roquefort, halloumi, ricotta, mascarpone, cream cheese, cottage cheese, red leicester, wensleydale, double gloucester, cheshire, lancashire, caerphilly, emmental, gruyere, jarlsberg, manchego, provolone, pecorino, asiago, havarti, monterey jack, colby, swiss cheese, goats cheese, paneer, queso fresco, burrata, taleggio, comte, raclette, reblochon, munster, limburger, boursin, babybel, philadelphia, mimolette, stinking bishop",
    bias: { cheddar: 2, brie: 1.3, feta: 1.3, edam: 0.6, swiss: 0.1 },
  },
  {
    id: "pasta",
    text: "Name a type of pasta",
    answers:
      "spaghetti, penne, fusilli, macaroni, lasagne|lasagna, tagliatelle, linguine, fettuccine, ravioli, tortellini, cannelloni, rigatoni, farfalle, conchiglie, orzo, gnocchi, vermicelli, angel hair|capellini, bucatini, pappardelle, ziti, cavatappi, radiatori, orecchiette, campanelle, rotini, ditalini, tagliolini, trofie, casarecce, paccheri, fregola, garganelli, strozzapreti, malloreddus, agnolotti, gemelli, mafalda, pastina, spaghettini",
    bias: { spaghetti: 2, penne: 1.5, fusilli: 1.4, macaroni: 1.2, orzo: 0.6 },
  },
  {
    id: "dessert",
    text: "Name a dessert",
    answers:
      "ice cream, cake, chocolate cake, cheesecake, brownie, cookie, biscuit, apple pie, pie, tart, crumble, apple crumble, trifle, tiramisu, pavlova, meringue, eton mess, sticky toffee pudding, bread and butter pudding, rice pudding, custard, creme brulee, panna cotta, mousse, chocolate mousse, profiterole, eclair, doughnut|donut, waffle, pancake, crepe, sundae, banana split, jelly, sorbet, gelato, baklava, churros, flan, fudge, macaron, cupcake, muffin, scone, victoria sponge, swiss roll, banoffee pie, lemon meringue pie, key lime pie, pecan pie, strudel, cannoli, affogato, semifreddo, syllabub, spotted dick, jam roly poly, knickerbocker glory, sponge pudding, treacle tart, bakewell tart",
    bias: { cake: 1.5, "ice cream": 2, custard: 0.8, jelly: 0.4, flan: 0.5 },
  },
  {
    id: "breakfast-food",
    text: "Name a breakfast food",
    answers:
      "cereal, toast, eggs, bacon, sausage, pancake, waffle, porridge, oatmeal, croissant, bagel, muffin, yoghurt|yogurt, fruit, banana, granola, muesli, cornflakes, weetabix, shredded wheat, scrambled eggs, fried egg, poached egg, boiled egg, omelette, beans on toast, baked beans, black pudding, hash brown, mushrooms, tomatoes, kipper, smoked salmon, crumpet, english muffin, french toast, cinnamon roll, danish pastry, pain au chocolat, sausage roll, bubble and squeak, kedgeree, congee, avocado toast, smoothie, marmalade, jam, honey, peanut butter, grapefruit, boiled ham, biscuits and gravy",
    bias: { eggs: 1.6, toast: 1.6, cereal: 1.8, bacon: 1.5, fruit: 0.4 },
  },
  {
    id: "cocktail",
    text: "Name a cocktail",
    answers:
      "martini, mojito, margarita, cosmopolitan, daiquiri, pina colada, negroni, old fashioned, manhattan, bloody mary, gin and tonic, screwdriver, tequila sunrise, long island iced tea, whisky sour, amaretto sour, mai tai, sex on the beach, white russian, black russian, espresso martini, aperol spritz, bellini, mimosa, sangria, caipirinha, moscow mule, dark and stormy, sidecar, gimlet, tom collins, french 75, sazerac, boulevardier, paloma, hurricane, zombie, singapore sling, pimms, snowball, brandy alexander, grasshopper, harvey wallbanger, rusty nail, mint julep, cuba libre, kir royale, bramble, penicillin, corpse reviver",
    bias: { martini: 1.5, mojito: 1.4, margarita: 1.4 },
  },
  {
    id: "herb-spice",
    text: "Name a herb or spice",
    answers:
      "basil, oregano, thyme, rosemary, sage, parsley, coriander|cilantro, mint, dill, chives, tarragon, bay leaf, marjoram, fennel, cumin, paprika, turmeric, ginger, cinnamon, nutmeg, cloves, cardamom, saffron, chilli powder, cayenne, black pepper, white pepper, mustard, mustard seed, garlic powder, onion powder, star anise, aniseed, caraway, coriander seed, allspice, mace, vanilla, lemongrass, curry powder, garam masala, five spice, sumac, za atar, harissa, fenugreek, asafoetida, juniper, horseradish, wasabi, poppy seed, sesame, celery salt, herbes de provence, lovage, chervil, borage, savory",
    bias: { mint: 0.4, sage: 0.2, ginger: 0.5, basil: 1.4, rosemary: 0.6, bay: 0.1 },
  },
  {
    id: "sandwich-filling",
    text: "Name a sandwich filling",
    answers:
      "cheese, ham, tuna, chicken, egg, egg mayonnaise, bacon, turkey, beef, roast beef, salami, pastrami, corned beef, prawn, prawn mayonnaise, coronation chicken, cheese and pickle, cheese and onion, ploughmans, blt, club, peanut butter, jam, marmite, nutella, banana, cucumber, tomato, lettuce, avocado, hummus, falafel, halloumi, sausage, fish finger, chip butty, brie and cranberry, tuna sweetcorn, chicken tikka, pulled pork, meatball, philly cheesesteak, reuben, croque monsieur, cream cheese and salmon, smoked salmon, coleslaw, sardine, liver pate, cheese and ham, mozzarella and tomato",
    bias: { cheese: 1.6, ham: 1.4, tuna: 1.3 },
  },
  {
    id: "soup",
    text: "Name a type of soup",
    answers:
      "tomato, chicken, chicken noodle, vegetable, minestrone, mushroom, cream of mushroom, leek and potato, French onion, oxtail, pea and ham, lentil, carrot and coriander, butternut squash, broccoli and stilton, cock a leekie, scotch broth, mulligatawny, gazpacho, borscht, miso, tom yum, pho, ramen, wonton, hot and sour, egg drop, clam chowder, chowder, bisque, lobster bisque, bouillabaisse, consomme, broth, bone broth, goulash, laksa, harira, avgolemono, minestra, chorba, sopa de ajo, split pea, black bean, chilli, cullen skink, celeriac, watercress, spinach, sweetcorn, pumpkin, gumbo, callaloo, tortilla soup, matzo ball, stracciatella",
    bias: { tomato: 1.6, chicken: 1.5 },
  },
  {
    id: "bread",
    text: "Name a type of bread",
    answers:
      "white, wholemeal, brown, sourdough, baguette, ciabatta, focaccia, pitta, naan, chapati, roti, paratha, tortilla, bagel, brioche, croissant, rye, pumpernickel, soda bread, cornbread, flatbread, breadstick, crumpet, muffin, english muffin, bap, roll, bun, cob, batch, bloomer, tiger bread, granary, seeded, multigrain, spelt, focaccia, challah, pretzel, panettone, stollen, banana bread, garlic bread, milk loaf, farmhouse, ficelle, fougasse, pain de campagne, pumpernickel, injera, lavash, barbari, arepa, pao de queijo, damper, bannock, sandwich loaf",
    bias: { white: 1.4, sourdough: 1.3, baguette: 1.3 },
  },
  {
    id: "curry",
    text: "Name a curry or Indian dish",
    answers:
      "tikka masala, korma, madras, vindaloo, jalfrezi, rogan josh, bhuna, dopiaza, pasanda, dhansak, balti, saag, saag aloo, aloo gobi, chana masala, dal, tarka dal, butter chicken, biryani, pilau, tandoori, naan, samosa, bhaji, onion bhaji, pakora, poppadom, raita, chutney, paneer, palak paneer, matar paneer, malai kofta, chicken chettinad, goan fish curry, thali, dosa, idli, vada, uttapam, korma, phall, ceylon, patia, achari, methi, karahi, handi, nihari, haleem, kofta, keema, kadai, lamb bhuna, prawn puri, chicken 65",
    bias: { "tikka masala": 1.8, korma: 1.4, vindaloo: 1.3 },
  },
  {
    id: "ice-cream-flavour",
    text: "Name an ice cream flavour",
    answers:
      "vanilla, chocolate, strawberry, mint choc chip, cookies and cream, rum and raisin, pistachio, salted caramel, toffee, honeycomb, coffee, banana, lemon, mango, raspberry ripple, neapolitan, rocky road, cookie dough, brownie, fudge brownie, peanut butter, coconut, hazelnut, tiramisu, stracciatella, bubblegum, blue moon, black cherry, blackcurrant, passion fruit, praline, butterscotch, maple, pecan, butter pecan, matcha, green tea, red bean, taro, ube, lavender, cardamom, saffron, rose, chocolate chip, double chocolate, white chocolate, caramel swirl, mango sorbet, lemon sorbet",
    bias: { vanilla: 1.8, chocolate: 1.6, strawberry: 1.5 },
  },
  {
    id: "sweet-chocolate",
    text: "Name a chocolate bar or sweet",
    answers:
      "mars, snickers, twix, bounty, milky way, galaxy, dairy milk, wispa, flake, crunchie, double decker, boost, picnic, star bar, curly wurly, chomp, fudge, freddo, aero, yorkie, kit kat, toffee crisp, lion bar, drifter, rolo, smarties, buttons, minstrels, maltesers, revels, celebrations, quality street, roses, ferrero rocher, toblerone, milka, lindt, after eight, matchmakers, terrys chocolate orange, creme egg, mini eggs, caramac, twirl, ripple, tunnocks teacake, caramel wafer, hershey, reeses, butterfinger, baby ruth, milk duds, skittles, starburst, haribo, wine gums, fruit pastilles, jelly babies, gummy bears, sherbet, refreshers, drumstick, black jack, fruit salad, love hearts, parma violets, flying saucers, rhubarb and custard, pear drops, humbugs, mint imperials, polo, extra strong mints, liquorice allsorts, aniseed balls, gobstopper, lollipop, chupa chups, toffee, fudge, turkish delight",
    bias: { "dairy milk": 1.4, mars: 1.3, "kit kat": 1.4 },
  },
  {
    id: "crisps-snack",
    text: "Name a crisp flavour or savoury snack",
    answers:
      "ready salted, salt and vinegar, cheese and onion, prawn cocktail, smoky bacon, roast chicken, beef, worcester sauce, sweet chilli, sour cream and chive, salt and pepper, barbecue, paprika, pickled onion, marmite, thai sweet chilli, flame grilled steak, tomato ketchup, cheddar, sea salt, balsamic vinegar, hoisin duck, wasabi, doritos, pringles, walkers, monster munch, wotsits, quavers, skips, frazzles, hula hoops, chipsticks, discos, squares, mccoys, kettle chips, tyrrells, sensations, nik naks, space raiders, scampi fries, bacon fries, pork scratchings, twiglets, cheeselets, mini cheddars, ritz, breadsticks, pretzels, popcorn, tortilla chips, nachos, poppadoms, bombay mix, peanuts, cashews, wasabi peas, olives",
    bias: { "ready salted": 1.5, "salt and vinegar": 1.5, "cheese and onion": 1.5 },
  },
  {
    id: "biscuit",
    text: "Name a biscuit",
    answers:
      "digestive, chocolate digestive, hobnob, rich tea, custard cream, bourbon, jammie dodger, party ring, nice, garibaldi, ginger nut, shortbread, viennese whirl, pink wafer, malted milk, fig roll, jaffa cake, penguin, club, blue riband, kit kat, breakaway, wagon wheel, tunnocks, caramel wafer, oreo, chocolate chip cookie, cookie, gingerbread, biscotti, macaroon, amaretti, langue de chat, florentine, brandy snap, cantuccini, speculoos, lotus, stroopwafel, animal biscuit, iced gem, bourbon cream, lemon puff, abernethy, oatcake, cracker, cream cracker, water biscuit, ryvita, matzo, wafer, snickerdoodle, shortcake, empire biscuit, melting moment",
    bias: { digestive: 1.6, hobnob: 1.3, "custard cream": 1.3 },
  },
  {
    id: "hot-drink",
    text: "Name a hot drink",
    answers:
      "tea, coffee, hot chocolate, latte, cappuccino, espresso, americano, flat white, macchiato, mocha, cortado, ristretto, filter coffee, instant coffee, decaf, english breakfast, earl grey, green tea, peppermint tea, chamomile, camomile tea, rooibos, chai, masala chai, jasmine tea, oolong, matcha, herbal tea, fruit tea, lemon and ginger, builders tea, milky coffee, irish coffee, mulled wine, mulled cider, hot toddy, bovril, ovaltine, horlicks, malted milk, hot squash, lemon and honey, turmeric latte, bone broth, hot ribena, hot blackcurrant, sahlab, atole, yerba mate",
    bias: { tea: 1.8, coffee: 1.8, "hot chocolate": 1.5 },
  },
  {
    id: "alcoholic-drink",
    text: "Name an alcoholic drink",
    answers:
      "beer, lager, ale, bitter, stout, guinness, cider, wine, red wine, white wine, rose, prosecco, champagne, cava, port, sherry, vermouth, whisky|whiskey, scotch, bourbon, rye, vodka, gin, rum, dark rum, white rum, spiced rum, tequila, mezcal, brandy, cognac, armagnac, calvados, absinthe, sambuca, ouzo, raki, grappa, schnapps, aquavit, soju, sake, baijiu, mead, perry, cachaca, pisco, amaretto, baileys, kahlua, tia maria, cointreau, triple sec, limoncello, campari, aperol, chartreuse, jagermeister, pastis, pernod, advocaat, snowball, shandy, alcopop, wkd, pimms, cherry brandy, creme de cassis, midori, malibu, southern comfort, drambuie, frangelico, disaronno",
    bias: { beer: 1.6, wine: 1.6, vodka: 1.3 },
  },
  {
    id: "sauce-condiment",
    text: "Name a sauce or condiment",
    answers:
      "ketchup, mayonnaise, mustard, english mustard, dijon, wholegrain mustard, brown sauce, hp sauce, worcestershire sauce, soy sauce, sweet chilli, sriracha, tabasco, hot sauce, barbecue sauce, salad cream, tartare sauce, horseradish, mint sauce, cranberry sauce, apple sauce, gravy, bread sauce, hollandaise, bearnaise, bechamel, veloute, white sauce, cheese sauce, tomato sauce, pesto, aioli, garlic mayo, ranch, thousand island, blue cheese dressing, caesar dressing, vinaigrette, balsamic, olive oil, chilli oil, hoisin, oyster sauce, fish sauce, teriyaki, ponzu, wasabi, chimichurri, salsa, guacamole, tzatziki, hummus, harissa, piri piri, peri peri, curry sauce, satay, tahini, chutney, mango chutney, piccalilli, branston, marmite, relish, pickle, vinegar, malt vinegar, tomato relish, tartar",
    bias: { ketchup: 1.8, mayonnaise: 1.6, mustard: 1.4 },
  },
  {
    id: "nut-seed",
    text: "Name a nut or seed",
    answers:
      "peanut, almond, cashew, walnut, hazelnut, pistachio, pecan, brazil nut, macadamia, chestnut, pine nut, coconut, acorn, beech nut, hickory, ginkgo nut, tiger nut, sunflower seed, pumpkin seed, sesame seed, chia seed, flax seed|linseed, poppy seed, hemp seed, caraway seed, fennel seed, mustard seed, coriander seed, cumin seed, nigella seed, quinoa, buckwheat, millet, amaranth, cocoa bean, coffee bean, nutmeg, monkey nut, kola nut, betel nut, candlenut, water chestnut, lotus seed, melon seed, safflower seed",
    bias: { peanut: 1.6, almond: 1.5, cashew: 1.3 },
  },
]
