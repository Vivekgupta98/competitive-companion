import { Sendable } from '../../models/Sendable';
import { TaskBuilder } from '../../models/TaskBuilder';
import { htmlToElement } from '../../utils/dom';
import { Parser } from '../Parser';

export class AlgoZenithLearningProblemParser extends Parser {
  public getMatchPatterns(): string[] {
    return ['https://www.learning.algozenith.com/problems/*'];
  }

  public async parse(url: string, html: string): Promise<Sendable> {
    const elem = htmlToElement(html);
    const task = new TaskBuilder('OTOG').setUrl(url);

    const problemName = elem.querySelector('p.text_white[style="font-family: poppins; font-size: 30px; font-weight: 300;"]').textContent;
    task.setName(problemName);

    const memoryLimit = Number(256);
    task.setMemoryLimit(memoryLimit);

    const timeLimit = Number(1);
    task.setTimeLimit(timeLimit * 1000);

    const inputs = elem.querySelectorAll('code.language-plaintext');

    inputs.forEach((inputElement, i) => {
      if (i % 2 == 0) {
        const outputElement = inputs[i+1];
        const input = inputElement.textContent;
        const output = outputElement.textContent;
        task.addTest(input, output);
      }
    });

    return task.build();
  }
}