export interface Planet {
  id: string;
  name: string;
  nameRu: string;
  radius: number; // km
  diameter: number; // km
  distanceFromSun: number; // million km
  orbitalPeriod: number; // Earth days
  rotationPeriod: number; // Earth hours
  moons: number;
  color: string;
  orbitRadius: number; // px for display
  size: number; // px for display
  speed: number; // relative orbital speed
  description: string;
}

export const planets: Planet[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    nameRu: 'Меркурий',
    radius: 2439,
    diameter: 4879,
    distanceFromSun: 57.9,
    orbitalPeriod: 88,
    rotationPeriod: 1407.6,
    moons: 0,
    color: '#b5b5b5',
    orbitRadius: 70,
    size: 8,
    speed: 4.15,
    description: 'Самая маленькая и ближайшая к Солнцу планета. Поверхность покрыта кратерами.'
  },
  {
    id: 'venus',
    name: 'Venus',
    nameRu: 'Венера',
    radius: 6051,
    diameter: 12104,
    distanceFromSun: 108.2,
    orbitalPeriod: 225,
    rotationPeriod: 5832.5,
    moons: 0,
    color: '#e8cda0',
    orbitRadius: 110,
    size: 14,
    speed: 1.62,
    description: 'Вторая планета от Солнца. Самая горячая планета из-за парникового эффекта.'
  },
  {
    id: 'earth',
    name: 'Earth',
    nameRu: 'Земля',
    radius: 6371,
    diameter: 12742,
    distanceFromSun: 149.6,
    orbitalPeriod: 365.25,
    rotationPeriod: 24,
    moons: 1,
    color: '#4a90d9',
    orbitRadius: 155,
    size: 15,
    speed: 1.0,
    description: 'Наш дом. Единственная известная планета с жизнью. 71% поверхности покрыто водой.'
  },
  {
    id: 'mars',
    name: 'Mars',
    nameRu: 'Марс',
    radius: 3389,
    diameter: 6779,
    distanceFromSun: 227.9,
    orbitalPeriod: 687,
    rotationPeriod: 24.6,
    moons: 2,
    color: '#c1440e',
    orbitRadius: 200,
    size: 11,
    speed: 0.53,
    description: 'Красная планета. Имеет самую высокую гору в Солнечной системе — Олимп.'
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    nameRu: 'Юпитер',
    radius: 69911,
    diameter: 139822,
    distanceFromSun: 778.5,
    orbitalPeriod: 4333,
    rotationPeriod: 9.9,
    moons: 95,
    color: '#c88b3a',
    orbitRadius: 270,
    size: 32,
    speed: 0.084,
    description: 'Самая большая планета. Газовый гигант с Большим Красным Пятном — гигантским штормом.'
  },
  {
    id: 'saturn',
    name: 'Saturn',
    nameRu: 'Сатурн',
    radius: 58232,
    diameter: 116464,
    distanceFromSun: 1434,
    orbitalPeriod: 10759,
    rotationPeriod: 10.7,
    moons: 146,
    color: '#e8d5a3',
    orbitRadius: 340,
    size: 28,
    speed: 0.034,
    description: 'Знаменита своими кольцами из льда и камней. Плотность меньше плотности воды.'
  },
  {
    id: 'uranus',
    name: 'Uranus',
    nameRu: 'Уран',
    radius: 25362,
    diameter: 50724,
    distanceFromSun: 2871,
    orbitalPeriod: 30687,
    rotationPeriod: 17.2,
    moons: 28,
    color: '#7ec8e3',
    orbitRadius: 400,
    size: 20,
    speed: 0.012,
    description: 'Ледяной гигант, вращающийся «на боку». Имеет тонкие кольца.'
  },
  {
    id: 'neptune',
    name: 'Neptune',
    nameRu: 'Нептун',
    radius: 24622,
    diameter: 49244,
    distanceFromSun: 4495,
    orbitalPeriod: 60190,
    rotationPeriod: 16.1,
    moons: 16,
    color: '#3f54ba',
    orbitRadius: 455,
    size: 19,
    speed: 0.006,
    description: 'Самая далёкая планета. Имеет самые сильные ветры в Солнечной системе — до 2100 км/ч.'
  }
];
