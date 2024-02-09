import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";

let num = 1;
export async function satelliteVideo() {
  const router = useRouter();
  console.log(router);
  let img: any = null;
  function getFormattedDate() {
    const today = new Date();

    // 현재 날짜
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");

    // 하루 전 날짜
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const yearYesterday = yesterday.getFullYear();
    const monthYesterday = (yesterday.getMonth() + 1)
      .toString()
      .padStart(2, "0");
    const dayYesterday = yesterday.getDate().toString().padStart(2, "0");

    // yyyymmdd 형식으로 변환
    const formattedDate = `${yearYesterday}${monthYesterday}${dayYesterday}`;

    return formattedDate;
  }

  const time = getFormattedDate();

  const KEY2 =
    "QSzEptJPem4a0vGXEhX/li2KNIcAuqN7OMaynW93+PX+nzlWlMIu0uoDEFCWxvZsFuEcLGBSbprIoTMAsUCoLw==";
  const KEY =
    "QSzEptJPem4a0vGXEhX%2Fli2KNIcAuqN7OMaynW93%2BPX%2BnzlWlMIu0uoDEFCWxvZsFuEcLGBSbprIoTMAsUCoLw%3D%3D";
  // console.log(getFormattedDate());
  //   const time = getFormattedDate();
  const { data } = await axios.get(
    "http://apis.data.go.kr/1360000/SatlitImgInfoService/getInsightSatlit",
    {
      params: {
        serviceKey: KEY2,
        // "QSzEptJPem4a0vGXEhX%2Fli2KNIcAuqN7OMaynW93%2BPX%2BnzlWlMIu0uoDEFCWxvZsFuEcLGBSbprIoTMAsUCoLw%3D%3D"
        pageNo: encodeURIComponent("1"),
        numOfRows: encodeURIComponent("10"),
        dataType: encodeURIComponent("JSON"),
        sat: encodeURIComponent("G2"),
        data: encodeURIComponent("ir105"),
        area: encodeURIComponent("ko"),
        time: encodeURIComponent(time),
      },
    }
  );
  return (data.response?.body.items.item[0]["satImgC-file"])
    .replace(/\[|\]/g, "")
    .split(",");
  // .then((res: AxiosResponse) => {
  //   console.log(res.data);
  //   const data = res.data;
  //   return data.response?.body.items.item;
  //   if (data.response && data.response.body && data.response.body.items) {
  //     console.log("items = ", data.response.body.items);
  //     return data.response?.body?.items?.item;
  //   } else {
  //     return null;
  //   }
  // });
}

export async function currentWeather({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}) {
  const APIkey = "8ed74ceb5e6a266b531ba7e0ec461a8d";
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`;
  const data = axios.get(url);
  return data;
}

export async function satelliteData({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}) {
  const url = "https://api.openweathermap.org/data/3.0/onecall";
  const appid = "8ed74ceb5e6a266b531ba7e0ec461a8d";
  const params = {
    lat,
    lon,
    exclude: "current",
    appid,
    lang: "kr",
  };

  const data: AxiosResponse = await axios.get(url, { params });
  return data;
}

export async function weatherMap() {
  // const APIkey = "7cc2b27996d4cbd87aa382b76a44cc19";
  const APIkey = "8ed74ceb5e6a266b531ba7e0ec461a8d";
  const op = "PAC0";
  const layer = "clouds_new";
  const z = 1;
  const x = 0;
  const y = 0;

  // const url = `http://maps.openweathermap.org/maps/2.0/weather/${op}/${z}/${x}/${y}?appid=${APIkey}`;
  const url = `https://tile.openweathermap.org/map/${layer}/${z}/${x}/${y}.png?appid=${APIkey}`;
  const data: AxiosResponse = await axios.get(url);
  return data;
}

export const geoData = async () => {
  const APIkey = "8ed74ceb5e6a266b531ba7e0ec461a8d";
  const limit = 5;
  const cityname = "seoul";
  const krCode = "+82";
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${krCode}&limit=${limit}&appid=${APIkey}`;
  const data: AxiosResponse = await axios.get(url);
  return data;
};

export const geoJson = () => {
  return new Promise((resolve) => {
    const arr = [
      [
        [
          [126.90173, 37.54486],
          [126.8968, 37.54889],
          [126.89622, 37.55025],
          [126.89745, 37.55072],
          [126.89831, 37.55756],
          [126.90009, 37.55889],
          [126.9052, 37.55739],
          [126.9175, 37.56256],
          [126.91155, 37.56836],
          [126.90975, 37.57011],
          [126.9, 37.57084],
          [126.89803, 37.57867],
          [126.89297, 37.58203],
          [126.88897, 37.58258],
          [126.88509, 37.58075],
          [126.8825, 37.57953],
          [126.87803, 37.58286],
          [126.87744, 37.59711],
          [126.87473, 37.60039],
          [126.87439, 37.6068],
          [126.8793, 37.61403],
          [126.88347, 37.61758],
          [126.8875, 37.61703],
          [126.88897, 37.61103],
          [126.88519, 37.60331],
          [126.88619, 37.59961],
          [126.88783, 37.59728],
          [126.89711, 37.59842],
          [126.89739, 37.59108],
          [126.9052, 37.58492],
          [126.90977, 37.58433],
          [126.91578, 37.59014],
          [126.91306, 37.59433],
          [126.91414, 37.60917],
          [126.91433, 37.6118],
          [126.91441, 37.61308],
          [126.92042, 37.62597],
          [126.92075, 37.62669],
          [126.91928, 37.63269],
          [126.92069, 37.63953],
          [126.92364, 37.64083],
          [126.93205, 37.63556],
          [126.93364, 37.63183],
          [126.92889, 37.62875],
          [126.9305, 37.62597],
          [126.93114, 37.62589],
          [126.93452, 37.62539],
          [126.93836, 37.62072],
          [126.93931, 37.61564],
          [126.94783, 37.61267],
          [126.95, 37.60939],
          [126.94859, 37.60347],
          [126.95556, 37.60464],
          [126.96117, 37.60128],
          [126.96355, 37.60305],
          [126.96311, 37.60628],
          [126.97867, 37.6063],
          [126.97908, 37.60264],
          [126.9725, 37.59639],
          [126.97311, 37.59478],
          [126.97353, 37.59361],
          [126.97791, 37.58844],
          [126.99167, 37.58625],
          [126.99314, 37.594],
          [126.9985, 37.59797],
          [127.01275, 37.59483],
          [127.01397, 37.59664],
          [127.01186, 37.60083],
          [127.00623, 37.60375],
          [127.00381, 37.61481],
          [127.00636, 37.62069],
          [127.01505, 37.62183],
          [127.01744, 37.62361],
          [127.01478, 37.62872],
          [127.01605, 37.63189],
          [127.01505, 37.63514],
          [127.01058, 37.63847],
          [127.01019, 37.64261],
          [127.0163, 37.65117],
          [127.01431, 37.65808],
          [127.01544, 37.65761],
          [127.01675, 37.66122],
          [127.02023, 37.66161],
          [127.02333, 37.65372],
          [127.02886, 37.64806],
          [127.0323, 37.6475],
          [127.03706, 37.65105],
          [127.03897, 37.65511],
          [127.03611, 37.66895],
          [127.03853, 37.67164],
          [127.04078, 37.67233],
          [127.04261, 37.67292],
          [127.04483, 37.68431],
          [127.04986, 37.69381],
          [127.05219, 37.69292],
          [127.05497, 37.69183],
          [127.06211, 37.68336],
          [127.06597, 37.68372],
          [127.06964, 37.68408],
          [127.07128, 37.68175],
          [127.06934, 37.67719],
          [127.0733, 37.67572],
          [127.07253, 37.67117],
          [127.06611, 37.66903],
          [127.05761, 37.65964],
          [127.0562, 37.65372],
          [127.05225, 37.65025],
          [127.04961, 37.64795],
          [127.04742, 37.637],
          [127.03489, 37.62725],
          [127.0408, 37.61747],
          [127.0442, 37.61553],
          [127.05775, 37.6225],
          [127.06178, 37.62239],
          [127.06316, 37.62067],
          [127.0667, 37.61628],
          [127.07592, 37.61603],
          [127.07964, 37.60994],
          [127.08019, 37.60903],
          [127.08536, 37.60797],
          [127.09431, 37.60222],
          [127.0983, 37.6012],
          [127.10247, 37.60428],
          [127.10997, 37.60453],
          [127.11139, 37.60283],
          [127.11272, 37.60122],
          [127.11297, 37.59433],
          [127.11261, 37.594],
          [127.10519, 37.58722],
          [127.10239, 37.57631],
          [127.0982, 37.57228],
          [127.09411, 37.57147],
          [127.09228, 37.56878],
          [127.09425, 37.56139],
          [127.09991, 37.55939],
          [127.10017, 37.55158],
          [127.1023, 37.54786],
          [127.10575, 37.54775],
          [127.1015, 37.54005],
          [127.0995, 37.5365],
          [127.09486, 37.53383],
          [127.09309, 37.53436],
          [127.09125, 37.53303],
          [127.0907, 37.53259],
          [127.08786, 37.53358],
          [127.08436, 37.53278],
          [127.07964, 37.52969],
          [127.07056, 37.51939],
          [127.06536, 37.51908],
          [127.06544, 37.51859],
          [127.06236, 37.51886],
          [127.05395, 37.52325],
          [127.04203, 37.53205],
          [127.03447, 37.53761],
          [127.02989, 37.53819],
          [127.02641, 37.53764],
          [127.02075, 37.53383],
          [127.0128, 37.52847],
          [127.00589, 37.5238],
          [126.98642, 37.51386],
          [126.9825, 37.51031],
          [126.98402, 37.50589],
          [126.97955, 37.50258],
          [126.97097, 37.50378],
          [126.95936, 37.5078],
          [126.956, 37.50969],
          [126.94647, 37.51506],
          [126.95061, 37.52367],
          [126.94986, 37.52505],
          [126.94639, 37.53158],
          [126.93314, 37.53672],
          [126.92973, 37.53806],
          [126.91255, 37.54039],
          [126.91092, 37.54092],
          [126.90375, 37.54319],
          [126.90173, 37.54486],
        ],
        [
          [126.96939, 37.57767],
          [126.97125, 37.58039],
          [126.96484, 37.59203],
          [126.96308, 37.59161],
          [126.95866, 37.583],
          [126.96194, 37.57833],
          [126.96939, 37.57767],
        ],
        [
          [127.06308, 37.54622],
          [127.06656, 37.54659],
          [127.07972, 37.55814],
          [127.07755, 37.56139],
          [127.07831, 37.56506],
          [127.08189, 37.56816],
          [127.07933, 37.57603],
          [127.07586, 37.5752],
          [127.05581, 37.55145],
          [127.05453, 37.54828],
          [127.05564, 37.54689],
          [127.06028, 37.54811],
          [127.06308, 37.54622],
        ],
        [
          [127.0883, 37.54367],
          [127.09364, 37.5472],
          [127.09197, 37.54861],
          [127.08222, 37.54933],
          [127.08041, 37.54803],
          [127.0798, 37.54711],
          [127.0843, 37.54425],
          [127.0883, 37.54367],
        ],
        [
          [127.00808, 37.53947],
          [127.01219, 37.54119],
          [127.01556, 37.55258],
          [127.01389, 37.554],
          [127.00989, 37.55455],
          [127.00747, 37.55189],
          [126.99661, 37.554],
          [126.99022, 37.55233],
          [126.99055, 37.54683],
          [127.00183, 37.54147],
          [127.00122, 37.54058],
          [127.00808, 37.53947],
        ],
        [
          [126.93661, 37.57856],
          [126.94017, 37.58122],
          [126.94319, 37.5887],
          [126.94117, 37.59128],
          [126.93719, 37.59278],
          [126.93189, 37.59014],
          [126.93058, 37.58606],
          [126.93317, 37.57911],
          [126.93661, 37.57856],
        ],
      ],
      [
        [
          [127.13328, 37.54725],
          [127.13286, 37.54836],
          [127.14047, 37.55136],
          [127.14839, 37.54839],
          [127.15058, 37.54603],
          [127.15067, 37.54303],
          [127.15083, 37.53822],
          [127.15047, 37.52997],
          [127.13961, 37.51928],
          [127.13333, 37.52039],
          [127.1283, 37.52372],
          [127.11997, 37.53686],
          [127.1197, 37.53728],
          [127.12089, 37.53817],
          [127.12344, 37.53719],
          [127.12486, 37.53667],
          [127.12722, 37.53814],
          [127.12839, 37.53886],
          [127.12922, 37.54436],
          [127.13386, 37.54558],
          [127.13328, 37.54725],
        ],
      ],
      [
        [
          [126.99136, 37.50517],
          [127.00261, 37.51564],
          [127.01644, 37.52583],
          [127.02216, 37.53006],
          [127.02411, 37.5315],
          [127.02959, 37.53181],
          [127.05744, 37.50989],
          [127.05844, 37.50911],
          [127.05936, 37.50669],
          [127.04564, 37.50219],
          [127.04336, 37.50272],
          [127.03683, 37.49833],
          [127.03308, 37.50483],
          [127.02775, 37.50086],
          [127.01972, 37.49978],
          [127.01095, 37.49858],
          [126.997, 37.50858],
          [126.99139, 37.50517],
          [126.99136, 37.50517],
        ],
      ],
      [
        [
          [126.73759, 37.51931],
          [126.73833, 37.5163],
          [126.7335, 37.51092],
          [126.72495, 37.5125],
          [126.72375, 37.51117],
          [126.73844, 37.50483],
          [126.74064, 37.50156],
          [126.73917, 37.4938],
          [126.73611, 37.48883],
          [126.73161, 37.48703],
          [126.72967, 37.48625],
          [126.71983, 37.48466],
          [126.71217, 37.4798],
          [126.7105, 37.48078],
          [126.70881, 37.48172],
          [126.71005, 37.48492],
          [126.70842, 37.48725],
          [126.70431, 37.48458],
          [126.69978, 37.48656],
          [126.69936, 37.49067],
          [126.70367, 37.49792],
          [126.69969, 37.49983],
          [126.69936, 37.50536],
          [126.70177, 37.5085],
          [126.69975, 37.51589],
          [126.70267, 37.51672],
          [126.71059, 37.51286],
          [126.71519, 37.51944],
          [126.71542, 37.51978],
          [126.715, 37.52286],
          [126.70934, 37.52528],
          [126.70953, 37.53033],
          [126.71533, 37.532],
          [126.72389, 37.5295],
          [126.73261, 37.53158],
          [126.74175, 37.53045],
          [126.74509, 37.52714],
          [126.73864, 37.52456],
          [126.73683, 37.5223],
          [126.73759, 37.51931],
        ],
      ],
      [
        [
          [126.983, 37.49183],
          [126.98367, 37.49289],
          [126.98936, 37.49136],
          [126.99, 37.48903],
          [126.99136, 37.48397],
          [126.98341, 37.47319],
          [126.9783, 37.47517],
          [126.9745, 37.4803],
          [126.97591, 37.48622],
          [126.97997, 37.48703],
          [126.983, 37.49183],
        ],
      ],
      [
        [
          [126.78455, 37.47236],
          [126.78098, 37.47439],
          [126.78075, 37.4782],
          [126.78064, 37.48036],
          [126.78156, 37.48145],
          [126.7867, 37.48756],
          [126.78156, 37.49708],
          [126.77739, 37.50017],
          [126.77872, 37.50472],
          [126.78297, 37.50967],
          [126.782, 37.51428],
          [126.78531, 37.51661],
          [126.78661, 37.51753],
          [126.79144, 37.52092],
          [126.79075, 37.53194],
          [126.79197, 37.53375],
          [126.80397, 37.53158],
          [126.80511, 37.51692],
          [126.80511, 37.51689],
          [126.80109, 37.51653],
          [126.79617, 37.50886],
          [126.79664, 37.50655],
          [126.80228, 37.50367],
          [126.80389, 37.50086],
          [126.79711, 37.48958],
          [126.80148, 37.48306],
          [126.80136, 37.4803],
          [126.80131, 37.47939],
          [126.79861, 37.47489],
          [126.797, 37.47217],
          [126.7923, 37.46997],
          [126.79064, 37.47139],
          [126.78772, 37.47055],
          [126.78455, 37.47236],
        ],
      ],
      [
        [
          [126.85539, 37.52328],
          [126.8525, 37.52164],
          [126.85222, 37.52186],
          [126.84695, 37.52636],
          [126.84341, 37.52461],
          [126.83861, 37.53436],
          [126.84216, 37.53658],
          [126.8345, 37.54594],
          [126.83628, 37.54772],
          [126.84258, 37.54711],
          [126.84495, 37.54842],
          [126.84336, 37.55167],
          [126.84697, 37.55572],
          [126.85217, 37.55603],
          [126.85783, 37.55359],
          [126.86031, 37.55586],
          [126.86117, 37.55664],
          [126.88236, 37.5475],
          [126.89853, 37.54064],
          [126.90269, 37.53886],
          [126.90747, 37.53689],
          [126.90772, 37.53686],
          [126.92528, 37.53545],
          [126.92892, 37.53392],
          [126.93769, 37.53025],
          [126.94183, 37.52667],
          [126.94278, 37.52269],
          [126.94305, 37.52158],
          [126.94225, 37.51725],
          [126.93686, 37.51283],
          [126.93941, 37.51161],
          [126.94234, 37.51244],
          [126.95003, 37.50706],
          [126.95403, 37.50428],
          [126.96875, 37.49903],
          [126.97283, 37.49536],
          [126.97097, 37.49233],
          [126.97058, 37.49028],
          [126.96878, 37.48092],
          [126.96169, 37.47653],
          [126.94914, 37.47869],
          [126.94733, 37.47692],
          [126.94945, 37.47272],
          [126.94945, 37.4585],
          [126.94775, 37.45947],
          [126.94653, 37.45814],
          [126.93861, 37.46108],
          [126.93447, 37.458],
          [126.92867, 37.45678],
          [126.92314, 37.46197],
          [126.92323, 37.46472],
          [126.93211, 37.47044],
          [126.92331, 37.4803],
          [126.91936, 37.48225],
          [126.91525, 37.48006],
          [126.9127, 37.47417],
          [126.90961, 37.47089],
          [126.90847, 37.4697],
          [126.90622, 37.47066],
          [126.90269, 37.46894],
          [126.90014, 37.46861],
          [126.89472, 37.46789],
          [126.89114, 37.46741],
          [126.88342, 37.47586],
          [126.883, 37.47908],
          [126.88664, 37.48358],
          [126.88339, 37.48872],
          [126.87481, 37.48986],
          [126.86906, 37.48806],
          [126.86664, 37.4873],
          [126.86884, 37.48497],
          [126.86955, 37.48514],
          [126.87058, 37.48539],
          [126.87267, 37.4798],
          [126.87211, 37.4753],
          [126.8718, 37.47297],
          [126.86903, 37.47533],
          [126.86328, 37.47503],
          [126.85392, 37.47158],
          [126.85228, 37.47347],
          [126.8585, 37.48525],
          [126.858, 37.48708],
          [126.84292, 37.48381],
          [126.84184, 37.48522],
          [126.83836, 37.48531],
          [126.83828, 37.48931],
          [126.83828, 37.48953],
          [126.83825, 37.49042],
          [126.83817, 37.49447],
          [126.84339, 37.49572],
          [126.84883, 37.5005],
          [126.85353, 37.50464],
          [126.86456, 37.50664],
          [126.8707, 37.50683],
          [126.88011, 37.50714],
          [126.882, 37.51122],
          [126.88097, 37.514],
          [126.87664, 37.5163],
          [126.87644, 37.51642],
          [126.8688, 37.51203],
          [126.86653, 37.513],
          [126.86222, 37.52],
          [126.86645, 37.52447],
          [126.86478, 37.52636],
          [126.86172, 37.52611],
          [126.86169, 37.52611],
          [126.86017, 37.526],
          [126.85539, 37.52328],
        ],
      ],
    ];
    const obj: any = [];
    arr.forEach((a: any) =>
      a.forEach((b: any) => {
        b.forEach((c: any) => {
          const o: any = { lat: c[1], lng: c[0] };
          obj.push(o);
        });
      })
    );

    // console.log(arr[0]);

    resolve([obj]);
  });
};
