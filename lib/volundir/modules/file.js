import { Coordinator } from '/lib/volundir/core/coordinator.js';

export class File extends Coordinator {
  async read(templatePath) {
    // console.log('===> loadFile(templatePath): ', templatePath);
    try {
      const response = await fetch(templatePath);

      if (!response.ok) {
        throw new Error(`${response.status} - Could not read ${templatePath}`);
      }

      return await response.text();

    } catch (error) {
      // console.error('Failed to read page:', error);
      return `<p>Failed to read page due to error: ${error.message}</p>`;
    }
  }
}
