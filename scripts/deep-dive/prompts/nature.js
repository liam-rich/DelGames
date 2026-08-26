// Curated prompt bank — nature.
// `answers` is a comma-separated list; `|` separates accepted aliases/spellings.
// `bias` nudges a corpus count where raw word frequency misleads (see build-bank.mjs):
//   < 1 makes an answer rarer (homographs inflate it), > 1 makes it more common.

export default [
  {
    id: "bird",
    text: "Name a bird",
    answers:
      "robin, sparrow, eagle, owl, penguin, pigeon, crow, seagull|gull, blackbird, magpie, swan, duck, goose, chicken, hen, parrot, flamingo, ostrich, peacock, pelican, falcon, hawk, vulture, woodpecker, kingfisher, heron, stork, swallow, starling, finch, canary, budgie|budgerigar, cockatoo, toucan, hummingbird, albatross, puffin, raven, wren, thrush, nightingale, lark, cuckoo, dove, turkey, pheasant, quail, partridge, emu, kiwi, kestrel, buzzard, osprey, condor, macaw, parakeet, jay, chaffinch, bullfinch, goldfinch, tit|blue tit, nuthatch, curlew, lapwing, oystercatcher, cormorant, gannet, tern, kittiwake, grebe, coot, moorhen, sandpiper, plover, egret, ibis, crane, roadrunner, kookaburra, lorikeet",
    bias: { robin: 0.5, crane: 0.2, swallow: 0.15, kiwi: 0.4, jay: 0.3, lark: 0.4, dove: 0.5, tit: 0.2, turkey: 0.2, hawk: 0.4, falcon: 0.5, raven: 0.5 },
  },
  {
    id: "insect",
    text: "Name an insect",
    answers:
      "ant, bee, wasp, butterfly, moth, fly|housefly, mosquito, beetle, ladybird|ladybug, dragonfly, grasshopper, cricket, cockroach, termite, caterpillar, flea, aphid, locust, hornet, bumblebee, firefly, mayfly, earwig, silverfish, weevil, midge, gnat, horsefly, stick insect, praying mantis|mantis, cicada, damselfly, lacewing, thrips, stag beetle, dung beetle, glow worm, boll weevil, tsetse fly, greenfly, blackfly, woodworm, leafhopper, sawfly, springtail",
    bias: { fly: 0.05, cricket: 0.1, ant: 0.6, bee: 0.7, bug: 0.2 },
  },
  {
    id: "tree",
    text: "Name a type of tree",
    answers:
      "oak, pine, birch, willow, maple, elm, ash, beech, sycamore, chestnut, walnut, cedar, redwood, sequoia, spruce, fir, poplar, aspen, hazel, hawthorn, holly, yew, rowan, alder, larch, cypress, juniper, magnolia, palm, coconut palm, banyan, baobab, eucalyptus, mahogany, teak, ebony, bamboo, olive, apple tree, cherry blossom, pear tree, fig tree, lime tree|linden, horse chestnut, monkey puzzle, ginkgo, acacia, cottonwood, hemlock, mangrove, jacaranda, tamarisk, blackthorn, elder, sweet chestnut, douglas fir, scots pine, weeping willow",
    bias: { ash: 0.1, holly: 0.2, olive: 0.3, palm: 0.3, elder: 0.2, hazel: 0.3, cherry: 0.4, bamboo: 0.6 },
  },
  {
    id: "flower",
    text: "Name a flower",
    answers:
      "rose, tulip, daisy, sunflower, daffodil, lily, orchid, carnation, chrysanthemum, peony, poppy, violet, pansy, petunia, marigold, lavender, bluebell, snowdrop, crocus, hyacinth, iris, dahlia, geranium, begonia, azalea, rhododendron, hydrangea, camellia, magnolia, jasmine, honeysuckle, foxglove, buttercup, dandelion, primrose, cowslip, forget me not, sweet pea, freesia, gladiolus, anemone, aster, zinnia, lupin, delphinium, hollyhock, wisteria, clematis, nasturtium, cornflower, heather, thistle, lotus, water lily, amaryllis, gardenia, hibiscus, bird of paradise, edelweiss, buddleia, cyclamen, gerbera",
    bias: { rose: 0.4, iris: 0.2, violet: 0.2, lily: 0.4, poppy: 0.5, jasmine: 0.3, heather: 0.2, daisy: 0.6 },
  },
  {
    id: "fungus",
    text: "Name a mushroom or fungus",
    answers:
      "mushroom, button mushroom, portobello, chestnut mushroom, chanterelle, porcini, morel, truffle, shiitake, oyster mushroom, enoki, king oyster, field mushroom, horse mushroom, puffball, giant puffball, fly agaric, death cap, destroying angel, deathcap, inkcap, shaggy ink cap, honey fungus, bracket fungus, chicken of the woods, beefsteak fungus, jelly ear, wood blewit, parasol mushroom, st georges mushroom, penny bun, bay bolete, cep, milk cap, russula, amanita, stinkhorn, earthstar, birds nest fungus, cauliflower fungus, dryads saddle, turkey tail, reishi, cordyceps, yeast, mould, mildew, lichen, athletes foot, dry rot",
    bias: { mushroom: 2, truffle: 1.2, "fly agaric": 1.1 },
  },
  {
    id: "garden-item",
    text: "Name something you'd find in a garden",
    answers:
      "grass, lawn, flowers, tree, hedge, shed, fence, gate, path, patio, decking, pond, fountain, birdbath, bird feeder, bird table, greenhouse, shrub, bush, compost heap, wheelbarrow, lawnmower, hose, watering can, spade, fork, trowel, rake, hoe, shears, secateurs, gnome, bench, table, chairs, parasol, barbecue, swing, trampoline, slide, sandpit, washing line, plant pot, hanging basket, window box, trellis, arch, pergola, rockery, vegetable patch, allotment, weeds, dandelion, worm, snail, slug, bee, butterfly, ladybird, hedgehog, fox, squirrel, robin, blackbird, wall, gravel, stepping stones, water butt, log pile, beehive, sundial, statue, tool shed, cold frame, cloche",
    bias: { grass: 1.6, flowers: 1.4, shed: 1.3 },
  },
  {
    id: "gemstone",
    text: "Name a gemstone or precious mineral",
    answers:
      "diamond, ruby, sapphire, emerald, amethyst, topaz, opal, jade, pearl, amber, garnet, aquamarine, turquoise, onyx, obsidian, quartz, rose quartz, citrine, peridot, tourmaline, tanzanite, moonstone, lapis lazuli, malachite, agate, jasper, bloodstone, carnelian, tigers eye, hematite, fluorite, alexandrite, zircon, spinel, morganite, kunzite, labradorite, sunstone, sodalite, azurite, rhodonite, jet, coral, ivory, marcasite, chrysoprase, iolite, apatite, kyanite, larimar",
    bias: { diamond: 2, ruby: 1.5, emerald: 1.4 },
  },
  {
    id: "metal-element",
    text: "Name a metal or chemical element",
    answers:
      "gold, silver, iron, copper, aluminium|aluminum, steel, bronze, brass, tin, lead, zinc, nickel, platinum, titanium, tungsten, chromium, cobalt, manganese, magnesium, calcium, sodium, potassium, lithium, mercury, uranium, plutonium, radium, hydrogen, helium, oxygen, nitrogen, carbon, sulphur|sulfur, phosphorus, chlorine, fluorine, neon, argon, krypton, xenon, radon, silicon, boron, beryllium, barium, strontium, caesium, rubidium, iodine, bromine, arsenic, antimony, bismuth, cadmium, palladium, rhodium, iridium, osmium, rhenium, molybdenum, vanadium, scandium, yttrium, zirconium, niobium, technetium, ruthenium, hafnium, tantalum, thallium, polonium, astatine, francium, actinium, thorium, americium, curium, einsteinium, germanium, gallium, indium, selenium, tellurium",
    bias: { gold: 1.8, silver: 1.5, iron: 1.4 },
  },
  {
    id: "constellation",
    text: "Name a constellation or star",
    answers:
      "orion, ursa major|great bear, ursa minor|little bear, cassiopeia, the plough|big dipper, southern cross, scorpius, sagittarius, leo, taurus, gemini, cancer, virgo, libra, aries, pisces, aquarius, capricorn, andromeda, perseus, pegasus, draco, cygnus, lyra, aquila, hercules, bootes, corona borealis, canis major, canis minor, auriga, cepheus, hydra, centaurus, crux, carina, vela, puppis, phoenix, pavo, tucana, dorado, sirius, polaris|north star, betelgeuse, rigel, vega, altair, deneb, arcturus, capella, procyon, aldebaran, antares, spica, regulus, castor, pollux, fomalhaut, canopus, alpha centauri, proxima centauri, bellatrix, mintaka, alnilam, alnitak, algol, mizar, thuban",
    bias: { orion: 1.6, "the plough": 1.2 },
  },
]
