
export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface GeoOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export const getCurrentPosition = (options?: GeoOptions): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000, // Permitir cache de 30s para resiliência
      ...options
    });
  });
};

export const checkPermissions = async (): Promise<PermissionState | 'unsupported'> => {
  if (!navigator.permissions || !navigator.permissions.query) {
    return 'unsupported';
  }

  try {
    const status = await navigator.permissions.query({ name: 'geolocation' as any });
    return status.state;
  } catch (e) {
    return 'unsupported';
  }
};

export const getIPLocation = async (): Promise<GeolocationPosition> => {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    
    if (data.error) throw new Error(data.reason || 'IP Location Error');

    return {
      coords: {
        latitude: data.latitude,
        longitude: data.longitude,
        accuracy: 1000, 
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
        toJSON: () => ({})
      },
      timestamp: Date.now(),
      toJSON: () => ({})
    } as GeolocationPosition;
  } catch (e) {
    throw new Error('Falha ao obter localização por IP');
  }
};
