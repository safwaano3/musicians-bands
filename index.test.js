const { sequelize } = require("./db");
const { Band, Musician, Song, Manager } = require("./index");

describe("Band, Musician, and Song Models", () => {
  /**
   * Runs the code prior to all tests
   */
  beforeAll(async () => {
    // the 'sync' method will create tables based on the model class
    // by setting 'force:true' the tables are recreated each time the
    // test suite is run
    await sequelize.sync({ force: true });
  });

  test("can create a Band", async () => {
    const band = await Band.create({
      name: "one direction",
      genre: "pop",
    });
    expect(band.name).toEqual("one direction");
    expect(band.genre).toEqual("pop");
  });

  test("can create a Musician", async () => {
    const musician = await Musician.create({
      name: "Tom",
      instrument: "guitar",
    });
    expect(musician.name).toEqual("Tom");
    expect(musician.instrument).toEqual("guitar");
  });

  test("can create a Song", async () => {
    const song = await Song.create({
      title: "Night changes",
      year: 2015,
      length: 4,
    });
    expect(song.title).toEqual("Night changes");
    expect(song.year).toEqual(2015);
    expect(song.length).toEqual(4);
  });

  test("can update a Band", async () => {
    const band = await Band.create({
      name: "two direction",
      genre: "rock",
    });
    const updatedBand = await band.update({
      name: "beetles",
      genre: "pop",
    });
    expect(updatedBand.name).not.toBe("two direction");
    expect(updatedBand.name).toBe("beetles");
  });

  test("can update a Musician", async () => {
    const musician = await Musician.create({
      name: "cody",
      instrument: "flute",
    });
    const updatedMusician = await musician.update({
      name: "rody",
    });
    expect(updatedMusician.name).not.toBe("cody");
    expect(updatedMusician.name).toBe("rody");
  });

  test("can update a Song", async () => {
    const song = await Song.create({
      title: "Day changes",
      year: 2020,
      length: 5,
    });
    const updatedSong = await song.update({
      title: "Stereo hearts",
    });
    expect(updatedSong.title).not.toBe("Day changes");
    expect(updatedSong.title).toBe("Stereo hearts");
  });

  test("can delete a Band", async () => {
    const band = await Band.findByPk(1);
    const deleted = await band.destroy();
    expect(band).toEqual(deleted);
  });

  test("can delete a Musician", async () => {
    const musician = await Musician.findByPk(1);
    const deleted = await musician.destroy();
    expect(musician).toEqual(deleted);
  });

  test("can delete a Song", async () => {
    const song = await Song.findByPk(1);
    const deleted = await song.destroy();
    expect(song).toEqual(deleted);
  });
});

describe("associations", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  test("band and musician association", async () => {
    const band1 = await Band.create({
      name: "KPOP",
      genre: "pop",
    });
    const band2 = await Band.create({
      name: "Beetles",
      genre: "classic",
    });
    const musicians = await Musician.bulkCreate([
      { name: "ab", instrument: "guitar" },
      { name: "cd", instrument: "piano" },
      { name: "ef", instrument: "flute" },
    ]);

    await band1.setMusicians([musicians[0], musicians[1]]);
    await band2.setMusicians([musicians[2]]);

    const band1_musicians = await band1.getMusicians();
    const band2_musicians = await band2.getMusicians();
    expect(band1_musicians.length).toBe(2);
    expect(band2_musicians.length).toBe(1);
  });

  test("band and musician association", async () => {
    const band1 = await Band.findByPk(1);
    const band2 = await Band.findByPk(2);
    const band3 = await Band.create({
      name: "Raiders",
      genre: "classic",
    });
    const songs = await Song.bulkCreate([
      { title: "sky", year: 2008, length: 5 },
      { title: "ground", year: 2010, length: 5 },
      { title: "wind", year: 2011, length: 4 },
      { title: "fire", year: 2020, length: 3 },
    ]);

    await band1.setSongs([songs[0], songs[1], songs[2]]);
    await songs[3].setBands([band2, band3]);

    const band1_songs = await band1.getSongs();
    const song2_bands = await songs[3].getBands();

    expect(band1_songs.length).toBe(3);
    expect(song2_bands.length).toBe(2);
  });

  test("manager and band association", async () => {
    const manager = await Manager.create({
      name: "Josh",
      email: "Josh@gmail.com",
      salary: 2000,
      dateHired: Date.now(),
    });
    const band = await Band.findByPk(1);
    await band.setManager(manager);
    const bandWithManager = await Band.findByPk(1, {
      include: Manager,
    });

    expect(bandWithManager.Manager.id).toBe(1);
  });

  test("eager loading", async () => {
    const bandsWithMusicians = await Band.findAll({
      include: [{ model: Musician, as: "Musicians" }],
    });
    const bandsWithSongs = await Band.findAll({
      include: [{ model: Song, as: "Songs" }],
    });

    expect(bandsWithMusicians[0].Musicians.length).toBe(2);
    expect(bandsWithSongs[0].Songs.length).toBe(3);
  });
});