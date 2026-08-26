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
]
