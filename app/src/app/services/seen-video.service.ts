import { computed, Injectable, linkedSignal, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { mapFromDtoToSeenVideoStat, SeenVideoStatDto } from '../dto/seen-video-stat.dto';
import { httpResource } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SeenVideoService {
  stat = linkedSignal(() => {
    const resource = this.getMyResource.value();
    return resource
      ? mapFromDtoToSeenVideoStat(resource)
      : null;
  });
  isLoading = computed(() => this.getMyResource.isLoading());

  private getMyResource = httpResource<SeenVideoStatDto>(
    () => `${environment.apiUrl}videos/stats`
  );
}
