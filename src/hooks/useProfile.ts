import { useState, useEffect } from 'react';
import { UserPreferences } from '../utils/nlp';

export const useProfile = () => {
  const [profile, setProfile] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('mealmap_profile');
    if (saved) {
      setProfile(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const saveProfile = (data: UserPreferences) => {
    localStorage.setItem('mealmap_profile', JSON.stringify(data));
    setProfile(data);
  };

  const clearProfile = () => {
    localStorage.removeItem('mealmap_profile');
    setProfile(null);
  };

  return { profile, saveProfile, clearProfile, loading };
};
