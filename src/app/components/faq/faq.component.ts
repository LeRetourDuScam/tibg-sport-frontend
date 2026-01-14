import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule } from 'lucide-angular';

interface FaqItem {
  id: number;
  questionKey: string;
  answerKey: string;
  category: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, LucideAngularModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent {
  selectedCategory = 'all';

  categories = [
    { id: 'all', labelKey: 'FAQ.CAT_ALL', iconName: 'layout-grid' },
    { id: 'trust', labelKey: 'FAQ.CAT_TRUST', iconName: 'shield' },
    { id: 'health', labelKey: 'FAQ.CAT_HEALTH', iconName: 'heart-pulse' },
    { id: 'results', labelKey: 'FAQ.CAT_RESULTS', iconName: 'bar-chart-3' },
    { id: 'data', labelKey: 'FAQ.CAT_DATA', iconName: 'database' }
  ];

  faqItems: FaqItem[] = [
    { id: 1, questionKey: 'FAQ.Q1_QUESTION', answerKey: 'FAQ.Q1_ANSWER', category: 'trust', isOpen: false },
    { id: 2, questionKey: 'FAQ.Q2_QUESTION', answerKey: 'FAQ.Q2_ANSWER', category: 'health', isOpen: false },
    { id: 3, questionKey: 'FAQ.Q3_QUESTION', answerKey: 'FAQ.Q3_ANSWER', category: 'trust', isOpen: false },
    { id: 4, questionKey: 'FAQ.Q4_QUESTION', answerKey: 'FAQ.Q4_ANSWER', category: 'data', isOpen: false },
    { id: 5, questionKey: 'FAQ.Q5_QUESTION', answerKey: 'FAQ.Q5_ANSWER', category: 'health', isOpen: false },
    { id: 6, questionKey: 'FAQ.Q6_QUESTION', answerKey: 'FAQ.Q6_ANSWER', category: 'results', isOpen: false },
    { id: 7, questionKey: 'FAQ.Q7_QUESTION', answerKey: 'FAQ.Q7_ANSWER', category: 'data', isOpen: false },
    { id: 8, questionKey: 'FAQ.Q8_QUESTION', answerKey: 'FAQ.Q8_ANSWER', category: 'data', isOpen: false }
  ];

  get filteredFaqItems(): FaqItem[] {
    if (this.selectedCategory === 'all') {
      return this.faqItems;
    }
    return this.faqItems.filter(item => item.category === this.selectedCategory);
  }

  toggleItem(item: FaqItem) {
    item.isOpen = !item.isOpen;
  }

  selectCategory(categoryId: string) {
    this.selectedCategory = categoryId;
    this.faqItems.forEach(item => item.isOpen = false);
  }
}
