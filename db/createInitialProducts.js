const {
  createProduct
} = require("./products");


const createInitialProducts = async () => {
  try {
    console.log("Starting to create products");
    const productsToCreate = [
      {
        name: "Cat Paw Tower",
        description:
          "Covered in cat paws so your little stinker can scritch-scratch away while also practicing their high-five skills!",
        price: 49.99,
        quantity: 20,
        imageName: "cat-paw-tower.jpg",
        categoryId: 2,
      },
      {
        name: "Pink Skull Collar",
        description:
          "Let everyone know that you have the baddest cat on the block. This collar makes a statement. Treat your kitty with this designer fashion piece today. You won't find it for this price anywhere else!",
        price: 14.99,
        quantity: 24,
        imageName: "pink-skulls.jpg",
        categoryId: 4,
      },
      {
        name: "Swimmy Fish Toy",
        description:
          "Looks like we're having seafood for dinner. Your cat will love this!",
        price: 1.99,
        quantity: 200,
        imageName: "fish.jpg",
        categoryId: 2,
      },
      {
        name: "Rainbow Ball Set",
        description:
          "Let your cat play like the queen he is. Scratch-ay away!",
        price: 7.49,
        quantity: 30,
        imageName: "rainbow-ball.jpg",
        categoryId: 2,
      },
      {
        name: "Springy Boing Toy!",
        description:
          "Designed and crafted by world-class engineers, these springs got some serious BOING.",
        price: 8.99,
        quantity: 36,
        imageName: "spring.jpg",
        categoryId: 2,
      },
      {
        name: "Fruit Toy Set",
        description:
          "Get your cat one step closer to completing their food pyramid.",
        quantity: 4.99,
        imageName: "fruit.jpg",
        categoryId: 4,
      },
      {
        name: "Crunchy Treats!",
        description:
          "Organic. Handcrafted in small batches. Made with Love. Give your cat the gift of tasty treats that are also great for their health.",
        price: 5,
        quantity: 50,
        imageName: "treat-1.jpg",
        categoryId: 1,
      },
      {
        name: "Mouse Toy Set",
        description:
          "Barn cat too good at its job and gettin' a little bored? Try these fluffy mice in 4 colors.",
        price: 5.99,
        quantity: 300,
        imageName: "mouse.jpg",
        categoryId: 2,
      },
      {
        name: "Cactus Tower",
        description:
          "Take your cat on a trip to the Wild West!",
        price: 84.99,
        quantity: 20,
        imageName: "cactus-tower.jpg",
        categoryId: 2,
      },
      {
        name: "Chicken Feast",
        description:
          "Lorem ipsum dolor sit amet, consectetur adiscing labore et dolore magna elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        price: .49,
        quantity: 42,
        imageName: "wet-food-2.jpg",
        categoryId: 1,
      },
      {
        name: "Chicken Feast in Gravy",
        description:
          "Lorem  do eiusmod tempor incididunt ut laboe et dolore magna aliqua.",
        price: 0.49,
        quantity: 57,
        imageName: "wet-food-1.jpg",
        categoryId: 1,
      },
      {
        name: "Small Tower",
        description:
          "Lorem ipsum dolor sit amet, consectetur adiscing labore et dolore magna elit, sadipiscing laboreadipiscing labore et dolore magna elit et dolore magna elited do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        price: 24.99,
        quantity: 42,
        imageName: "small-tower.jpg",
        categoryId: 2,
      },
      {
        name: "Treat Box",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing labore et dolore mgna elit, sadipiscing laboreadipiscing labore et dolore magna elit et dolore magna elited do dolore magna elited do eiusmod tempor eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        price: 9.99,
        quantity: 42,
        imageName: "treat-2.jpg",
        categoryId: 1,
      },
      {
        name: "Adult Cat Food",
        description:
          "boread ipiscing labore et dolore magna elit et dolore magna elited do dolore magna elid do eiusmod tempor eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        price: 14.99,
        quantity: 17,
        imageName: "food-1.jpg",
        categoryId: 1,
      },
      {
        name: "Neon Toy Set",
        description:
          "eadipiscing labore et dolore magna elit et dolore magmod tempor incididunt ut labore et dore magna aliqua.",
        price: 4.99,
        quantity: 15,
        imageName: "neon.jpg",
        categoryId: 2,
      },
      {
        name: "Unicorn Bed",
        description:
          "ed do dolore magna elited do eiusmodr incididunt ut labore et dolore agna aliqua.",
        price: 20.99,
        quantity: 42,
        imageName: "unicorn.jpg",
        categoryId: 4,
      },
      {
        name: "Holiday Scarf",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing labore et dolore magna it.",
        price: 27.49,
        quantity: 5,
        imageName: "holiday-1.jpg",
        categoryId: 4,
      },
      {
        name: "Large Cat Tower",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing labore et dolore magna elit, sadiscing laboreadipiscing labore et dolore magna elit et dolore magna elited do dolore magna elited do eiusmod tempor eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        price: 99.99,
        quantity: 10,
        imageName: "large-tower.jpg",
        categoryId: 2,
      },
      {
        name: "Fluffy Bed",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing laboreaipiscing labore et dolre magna elit et dolore magna elited do dolore magna elited do eiusmod tempor eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        price: 15.00,
        quantity: 54,
        imageName: "bed.jpg",
        categoryId: 4,
      },
      {
        name: "Food Multipack",
        description:
          "Lorem ipsum dolor boread iscing labore et dolore magna elt et dolore magna elited do dolore magna elited do eiusmod tempor eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        price: 25.49,
        quantity: 25,
        imageName: "wet-food-3.jpg",
        categoryId: 1,
      },
      {
        name: "Catnip",
        description:
          "labore et dolore magna elit et dolore magna elited do dole magna elited do eiusmod tempor eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        price: 3.99,
        quantity: 42,
        imageName: "catnip.jpg",
        categoryId: 1,
      },
      {
        name: "Chicken & Cheese Feast",
        description:
          "eiusmod tempor incididunt ut labore et dolore mana aliqua.",
        price: 3.99,
        quantity: 22,
        imageName: "wet-food-4.jpg",
        categoryId: 1,
      },
      {
        name: "Color Mouse Set",
        description:
          "eiusmod tempor incididunt ut labore et dolore magna aiqua.",
        price: 5.99,
        quantity: 35,
        imageName: "color-mouse.jpg",
        categoryId: 2,
      },
      {
        name: "Dry Food",
        description:
          "eiusmod tempor incididunt ut labore et dolore magna ala.",
        price: 12.99,
        quantity: 26,
        imageName: "food-2.jpg",
        categoryId: 1,
      },
      {
        name: "Yellow Collar",
        description:
          "eiusmod tempor incididunt ut labor et dolore magna aua.",
        price: 12.99,
        quantity: 35,
        imageName: "yellow-collar.jpg",
        categoryId: 4,
      },
      {
        name: "Fluffy Stuffy Cat",
        description:
          "Get this BIG guy before he goes out-of-stock! Limited Edition Fluffy Stuffy Cat. The fluffiest guy in town. Can't beat this price!!",
        price: 199.99,
        quantity: 5,
        imageName: "stuffed.jpg",
        categoryId: 2,
      }
    ];
    const products = await Promise.all(productsToCreate.map(createProduct));
    console.log("Products created");
    console.log(products);
  } catch (error) {
    console.log("Error creating products");
    console.error(error);
  }
};

module.exports = createInitialProducts;