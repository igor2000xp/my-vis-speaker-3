import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProgressService } from '../progress.service';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Chart, registerables } from 'chart.js';
@Component({
  selector: 'app-progress',
  standalone: true,
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss',
})
export class ProgressComponent implements OnInit, OnDestroy {
  progress$: Observable<any> | undefined; // Use Observable for async data
  progressSubscription: Subscription | undefined;

  errorTypeChart: Chart | undefined;
  practiceSessionsChart: Chart | undefined;

  constructor(private progressService: ProgressService) {}

  ngOnInit(): void {
    Chart.register(...registerables);

    this.progress$ = this.progressService.getUserProgress().pipe(
      map(progressData => {
        // Process data for visualizations
        const errorTypes = progressData.errorTypeBreakdown || {};
        const sessionDates = progressData.sessionDates || [];
        const sessionCounts = progressData.sessionCounts || [];

        return {
          errorTypes,
          sessionDates,
          sessionCounts,
        };
      }),
    );

    this.progressSubscription = this.progress$.subscribe(data => {
      this.renderErrorTypeChart(data.errorTypes);
      this.renderPracticeSessionsChart(data.sessionDates, data.sessionCounts);
    });
  }

  ngOnDestroy(): void {
    if (this.progressSubscription) {
      this.progressSubscription.unsubscribe();
    }
    if (this.errorTypeChart) {
      this.errorTypeChart.destroy();
    }
    if (this.practiceSessionsChart) {
      this.practiceSessionsChart.destroy();
    }
  }

  renderErrorTypeChart(errorTypes: any): void {
    const ctx = document.getElementById('errorTypeChart') as HTMLCanvasElement;
    if (ctx) {
      this.errorTypeChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: Object.keys(errorTypes),
          datasets: [
            {
              data: Object.values(errorTypes),
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9900'], // Example colors
            },
          ],
        },
      });
    }
  }

  renderPracticeSessionsChart(dates: string[], counts: number[]): void {
    const ctx = document.getElementById('practiceSessionsChart') as HTMLCanvasElement;
    if (ctx) {
      this.practiceSessionsChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: dates,
          datasets: [
            {
              label: 'Practice Sessions',
              data: counts,
              backgroundColor: '#36A2EB',
            },
          ],
        },
      });
    }
  }
}
