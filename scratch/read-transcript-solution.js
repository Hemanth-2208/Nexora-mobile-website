const fs = require('fs');
const readline = require('readline');

async function main() {
  const filePath = 'C:\\Users\\heman\\.gemini\\antigravity-ide\\brain\\3bcfba45-14d8-47fe-b406-6639350379cd\\.system_generated\\logs\\transcript.jsonl';
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineCount = 0;
  for await (const line of rl) {
    lineCount++;
    if (line.includes('useMobiles.ts') && line.includes('replace_file_content')) {
      console.log(`Line ${lineCount}:`);
      console.log(line.substring(0, 1000));
      console.log("\n==================================\n");
    }
  }
}

main();
