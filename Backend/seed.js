const sequelize = require("./db");
const Product = require("./models/Product");

const products = [
  {
    name: "Nike Air Jordan 1 Retro High OG",
    price: 1999,
    description: "En klassisk basketsko som blivit en streetwear-ikon. Chicago-färgerna i rött, vitt och svart.",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
  },
  {
    name: "Adidas Ultraboost 22",
    price: 1799,
    description: "Löpsko med responsiv Boost-dämpning och Primeknit-överdel. Perfekt för långa distanser.",
    imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80",
  },
  {
    name: "Nike Air Force 1 Low White",
    price: 1099,
    description: "Den tidlösa vitan. Air Force 1 i rent vit läder — en stapelvara i varje garderob.",
    imageUrl: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80",
  },
  {
    name: "New Balance 550 White Green",
    price: 1299,
    description: "Retro-basketsilhuett från 1989 med mjukt skinnöverdel och ikonisk N-logotyp.",
    imageUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80",
  },
  {
    name: "Puma Suede Classic",
    price: 799,
    description: "En äkta legend sedan 1968. Sammetsmjukt mockaöverdel och formstabil sula.",
    imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80",
  },
  {
    name: "Converse Chuck Taylor All Star Hi",
    price: 699,
    description: "Det ursprungliga basketstövelplagg från 1917. Canvas-överdel och gummitåkappa.",
    imageUrl: "https://images.unsplash.com/photo-1494496195158-c3bc2a33de1f?w=600&q=80",
  },
  {
    name: "Vans Old Skool Black White",
    price: 749,
    description: "Skateskon med det berömda Jazz-stripedet. Slitstark canvas och mocka-kombination.",
    imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80",
  },
  {
    name: "Adidas Stan Smith White Green",
    price: 899,
    description: "Tennislegenden som blivit streetwear-favorit. Rent läder och perforerat S-mönster.",
    imageUrl: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=600&q=80",
  },
  {
    name: "Nike Dunk Low Panda",
    price: 1499,
    description: "Svart och vitt i perfekt balans. Dunken är tillbaka och starkare än någonsin.",
    imageUrl: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=600&q=80",
  },
  {
    name: "Reebok Classic Leather",
    price: 849,
    description: "Mjukt nappa-läder och EVA-mellanssula. En minimalistisk löparsneaker från 1983.",
    imageUrl: "https://images.unsplash.com/photo-1556906781-9a412961a28c?w=600&q=80",
  },
  {
    name: "Jordan 4 Retro Military Blue",
    price: 2499,
    description: "En av de mest efterfrågade Jordan-siluetterna. Militärblå detaljer på vitt meshöverdel.",
    imageUrl: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600&q=80",
  },
  {
    name: "Nike React Element 55",
    price: 1199,
    description: "Framtidsinspirerad design med React-skum för mjuk och responsiv komfort.",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
  },
];

async function seed() {
  await sequelize.sync();

  let created = 0;
  let skipped = 0;

  for (const data of products) {
    const [, wasCreated] = await Product.findOrCreate({
      where: { name: data.name },
      defaults: data,
    });
    if (wasCreated) created++;
    else skipped++;
  }

  console.log(`✅ Seed klar — ${created} produkter skapade, ${skipped} redan i databasen.`);
  await sequelize.close();
}

seed().catch((err) => {
  console.error("Seed misslyckades:", err);
  process.exit(1);
});
