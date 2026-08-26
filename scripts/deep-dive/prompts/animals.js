// Curated prompt bank — animals.

export default [
  {
    id: "four-legged-animal",
    text: "Name a four-legged animal",
    answers:
      "dog, cat, horse, cow, sheep, goat, pig, lion, tiger, elephant, giraffe, zebra, bear, wolf, fox, deer, rabbit, mouse, rat, squirrel, hippo|hippopotamus, rhino|rhinoceros, leopard, cheetah, panther, jaguar, hyena, badger, otter, beaver, raccoon, skunk, hedgehog, mole, ferret, weasel, stoat, camel, llama, alpaca, donkey, mule, moose, elk, reindeer, antelope, gazelle, buffalo, bison, yak, panda, koala, kangaroo, wombat, sloth, armadillo, anteater, tapir, warthog, meerkat, lemur, baboon, chimpanzee, gorilla, orangutan, wildebeest, ibex, chamois, capybara, porcupine, chinchilla, hamster, guinea pig, gerbil, chipmunk, marmot, okapi, aardvark, pangolin, wallaby, dingo, coyote, jackal, lynx, bobcat, cougar, ocelot, serval, caracal, mongoose, civet, binturong",
    bias: { bear: 0.15, mole: 0.2, mouse: 0.3, rat: 0.4, seal: 0.2, ox: 0.3, doe: 0.2, fox: 0.6, panther: 0.5 },
  },
  {
    id: "sea-creature",
    text: "Name a sea creature",
    answers:
      "shark, dolphin, whale, octopus, squid, jellyfish, crab, lobster, starfish, seahorse, turtle, stingray, eel, clam, oyster, mussel, scallop, prawn, shrimp, krill, barnacle, sea urchin, sea anemone, coral, manatee, dugong, walrus, seal, sea lion, narwhal, orca|killer whale, blue whale, humpback, sperm whale, beluga, porpoise, manta ray, hammerhead, great white shark, whale shark, swordfish, marlin, tuna, cod, salmon, herring, mackerel, sardine, anchovy, plaice, halibut, haddock, pufferfish, clownfish, angelfish, lionfish, anglerfish, moray eel, cuttlefish, nautilus, sea slug, sea cucumber, plankton, barracuda, grouper, snapper, sunfish, sawfish, remora, tarpon, wrasse, blenny, goby, limpet, whelk, cockle, periwinkle, sponge, siphonophore, viperfish, gulper eel",
    bias: { seal: 0.2, ray: 0.1, sole: 0.1, bass: 0.2, crab: 0.7, coral: 0.4, sponge: 0.2 },
  },
  {
    id: "dog-breed",
    text: "Name a breed of dog",
    answers:
      "labrador|lab, poodle, bulldog, beagle, dachshund|sausage dog, chihuahua, pug, husky, german shepherd|alsatian, golden retriever, rottweiler, doberman, boxer, dalmatian, greyhound, whippet, collie, border collie, corgi, spaniel, cocker spaniel, springer spaniel, terrier, jack russell, yorkshire terrier|yorkie, west highland terrier|westie, staffordshire bull terrier|staffie, bull terrier, pit bull, mastiff, great dane, saint bernard, newfoundland, bernese mountain dog, akita, shiba inu, chow chow, shar pei, basset hound, bloodhound, foxhound, wolfhound, deerhound, afghan hound, saluki, samoyed, malamute, pomeranian, maltese, shih tzu, lhasa apso, bichon frise, papillon, pekingese, schnauzer, weimaraner, vizsla, pointer, setter, irish setter, retriever, sheepdog, old english sheepdog, australian shepherd, kelpie, dingo, basenji, borzoi, keeshond, cairn terrier, airedale, whippet",
    bias: { boxer: 0.1, pointer: 0.1, setter: 0.2, collie: 1.4, pug: 1.3, corgi: 1.2 },
  },
  {
    id: "reptile",
    text: "Name a reptile",
    answers:
      "snake, lizard, crocodile, alligator, turtle, tortoise, gecko, iguana, chameleon, python, boa constrictor, anaconda, cobra, king cobra, rattlesnake, viper, adder, grass snake, mamba, black mamba, garter snake, corn snake, milk snake, sidewinder, komodo dragon, monitor lizard, skink, slow worm, terrapin, caiman, gharial, bearded dragon, frilled lizard, horned lizard, gila monster, tuatara, anole, basilisk, sea turtle, leatherback, snapping turtle, box turtle, galapagos tortoise, chuckwalla, agama, tegu",
    bias: { adder: 0.3, monitor: 0.05, python: 0.2, viper: 0.4, boa: 0.3 },
  },
  {
    id: "big-cat",
    text: "Name a big cat",
    answers:
      "lion, tiger, leopard, cheetah, jaguar, panther, black panther, cougar, puma, mountain lion, lynx, bobcat, snow leopard, clouded leopard, ocelot, serval, caracal, jaguarundi, margay, fishing cat, sand cat, liger, tigon, asiatic lion, bengal tiger, siberian tiger, white tiger, amur leopard",
    bias: { jaguar: 0.3, puma: 0.3, cougar: 0.4, panther: 0.4, lynx: 0.5 },
  },
  {
    id: "farm-animal",
    text: "Name a farm animal",
    answers:
      "cow, sheep, pig, chicken, horse, goat, duck, goose, turkey, donkey, hen, rooster|cockerel, lamb, calf, piglet, bull, ox, sow, ram, ewe, foal, pony, alpaca, llama, rabbit, guinea fowl, pheasant, quail, dog, cat, sheepdog, mule, bullock, heifer, gander, gosling, duckling, chick, kid, billy goat, nanny goat, boar, stallion, mare, emu, ostrich, peacock, turkey hen",
    bias: { ox: 0.3, ram: 0.1, kid: 0.02, sow: 0.1, mare: 0.4, boar: 0.4, chick: 0.1 },
  },
]
