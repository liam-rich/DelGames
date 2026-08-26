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
]
