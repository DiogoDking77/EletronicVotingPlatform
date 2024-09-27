// voting-info-card.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-voting-info-card',
  templateUrl: './voting-info-card.component.html',
  styleUrls: ['./voting-info-card.component.css']
})
export class VotingInfoCardComponent {
  @Input() phaseType!: string;
  @Input() nChoices!: number;
  @Input() orderPoints!: any[];
  @Input() nWinners!: number;
  @Input() nPhases!: number;
  @Input() PhasesIndex!: number;

  getVotingInfo(): string {
    if (this.phaseType === 'Simple Voting') {
      return 'Choose a single option when voting.';
    } else if (this.phaseType === 'Multiple Voting') {
      return `Select up to ${this.nChoices} options when voting.`;
    } else if (this.phaseType === 'Points Voting' && this.orderPoints && this.orderPoints.length > 0) {
      const info = this.orderPoints[0][0].value;

      try {
        const parsedInfo = JSON.parse(info);

        // Ordena o array com base nas posições
        parsedInfo.sort((a: any, b: any) => a.position - b.position);

        const topNChoices = this.nChoices;

        const listItems = parsedInfo.map((positionInfo: any) =>
          `• The ${this.getOrdinalNumber(positionInfo.position)} place will receive ${positionInfo.points} points.<br>`).join('');

        return `Select your top ${topNChoices} when voting.<br>${listItems}`;
      } catch (error) {
        console.error('Error parsing orderPoints information:', error);
        return 'Error parsing orderPoints information.';
      }
    }

    return '';
  }

  getOrdinalNumber(position: number): string {
    // Implementação do número ordinal
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const remainder = position % 100;
    const suffix = suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0];
    return position + suffix;
  }

  getPhaseOutcomeInfo(): string {
    if (this.PhasesIndex < this.nPhases - 1) {
      // Se não for a última fase, retorne a informação sobre quantos passam para a próxima fase
      return `Top ${this.nWinners} choices will advance to the next phase.`;
    } else {
      // Se for a última fase, retorne a informação sobre quantos ganham
      return `Top ${this.nWinners} choices will win.`;
    }
  }


}
