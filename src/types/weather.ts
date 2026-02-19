
export type City = {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;
};

export type CurrentWeather = {
    temperature_2m: number;
    wind_speed_10m: number;
};


export type DailyWeather = {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
};


export type WeatherResponse = {
    current: CurrentWeather;
    daily: DailyWeather;
};

export type GeocodingResponse = {
    results?: {
        name: string;
        country: string;
        latitude: number;
        longitude: number;
        timezone: string;
    }[];
};
