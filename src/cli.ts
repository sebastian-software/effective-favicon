import { processSvgFiles } from './index';

const args = process.argv.slice(2);
if (args.length !== 1) {
  console.error("Usage: ts-node convertIcons.ts <directory>");
  process.exit(1);
}

processSvgFiles(args[0]).catch(console.error);
