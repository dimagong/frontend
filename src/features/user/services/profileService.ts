import { APIService } from "features/common";

interface NotifyEntry<TNotify> {
  id: number;
  notify: TNotify;
}

type IntroductionNotify = {
  id: number;
  intro_text: string;
  intro_title: string;
  download_text: string;
};

type IntroductionNotifyEntry = NotifyEntry<IntroductionNotify>;

type NotifyEntries = IntroductionNotifyEntry;

export type ProfileResponse = {
  id: number;
  name: string;
  first_name: string;
  avatar: {
    id: number;
  } | null;
  permissions: {
    logo: { id: number } | null;
    organization: string;
    organization_id: number;
    organization_type: string;
  };
  notify_entries: NotifyEntries[];
};

export class ProfileService {
  static get(): Promise<ProfileResponse> {
    const url = `${APIService.prefix}/user/profile`;

    return APIService.apiClient.get(url);
  }
}
