export interface CodingChallenge {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  company: string;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  starterCode: string;
  testCases: { input: string; expectedOutput: string }[];
  timeLimit: number; // in minutes
}

export const codingChallenges: CodingChallenge[] = [
  {
    id: "code-1",
    title: "Two Sum",
    difficulty: "easy",
    company: "Google",
    description: "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`. You may assume each input has exactly one solution.",
    examples: [
      { input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]", explanation: "Because nums[0] + nums[1] == 9" },
      { input: "nums = [3, 2, 4], target = 6", output: "[1, 2]" },
    ],
    starterCode: `function twoSum(nums, target) {\n  // Write your solution here\n  \n}`,
    testCases: [
      { input: "twoSum([2,7,11,15], 9)", expectedOutput: "[0,1]" },
      { input: "twoSum([3,2,4], 6)", expectedOutput: "[1,2]" },
      { input: "twoSum([3,3], 6)", expectedOutput: "[0,1]" },
    ],
    timeLimit: 15,
  },
  {
    id: "code-2",
    title: "Reverse a String",
    difficulty: "easy",
    company: "TCS",
    description: "Write a function that reverses a string. The input is given as an array of characters. You must do this by modifying the input array in-place.",
    examples: [
      { input: '["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
      { input: '["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' },
    ],
    starterCode: `function reverseString(s) {\n  // Write your solution here\n  \n}`,
    testCases: [
      { input: 'reverseString(["h","e","l","l","o"])', expectedOutput: '["o","l","l","e","h"]' },
      { input: 'reverseString(["H","a","n","n","a","h"])', expectedOutput: '["h","a","n","n","a","H"]' },
    ],
    timeLimit: 10,
  },
  {
    id: "code-3",
    title: "FizzBuzz",
    difficulty: "easy",
    company: "Infosys",
    description: "Given an integer `n`, return an array where for each number from 1 to n: if divisible by 3 and 5 → 'FizzBuzz', by 3 → 'Fizz', by 5 → 'Buzz', else the number as a string.",
    examples: [
      { input: "n = 5", output: '["1","2","Fizz","4","Buzz"]' },
      { input: "n = 15", output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]' },
    ],
    starterCode: `function fizzBuzz(n) {\n  // Write your solution here\n  \n}`,
    testCases: [
      { input: "fizzBuzz(3)", expectedOutput: '["1","2","Fizz"]' },
      { input: "fizzBuzz(5)", expectedOutput: '["1","2","Fizz","4","Buzz"]' },
      { input: "fizzBuzz(15)", expectedOutput: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]' },
    ],
    timeLimit: 10,
  },
  {
    id: "code-4",
    title: "Valid Parentheses",
    difficulty: "medium",
    company: "Amazon",
    description: "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. A string is valid if brackets are closed in the correct order.",
    examples: [
      { input: '"()"', output: "true" },
      { input: '"()[]{}"', output: "true" },
      { input: '"(]"', output: "false" },
    ],
    starterCode: `function isValid(s) {\n  // Write your solution here\n  \n}`,
    testCases: [
      { input: 'isValid("()")', expectedOutput: "true" },
      { input: 'isValid("()[]{}")', expectedOutput: "true" },
      { input: 'isValid("(]")', expectedOutput: "false" },
      { input: 'isValid("([)]")', expectedOutput: "false" },
    ],
    timeLimit: 15,
  },
  {
    id: "code-5",
    title: "Palindrome Check",
    difficulty: "easy",
    company: "Wipro",
    description: "Given a string, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases.",
    examples: [
      { input: '"A man, a plan, a canal: Panama"', output: "true" },
      { input: '"race a car"', output: "false" },
    ],
    starterCode: `function isPalindrome(s) {\n  // Write your solution here\n  \n}`,
    testCases: [
      { input: 'isPalindrome("A man, a plan, a canal: Panama")', expectedOutput: "true" },
      { input: 'isPalindrome("race a car")', expectedOutput: "false" },
      { input: 'isPalindrome("")', expectedOutput: "true" },
    ],
    timeLimit: 10,
  },
  {
    id: "code-6",
    title: "Maximum Subarray",
    difficulty: "medium",
    company: "Microsoft",
    description: "Given an integer array `nums`, find the contiguous subarray which has the largest sum and return its sum.",
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "Subarray [4,-1,2,1] has the largest sum = 6" },
      { input: "nums = [1]", output: "1" },
    ],
    starterCode: `function maxSubArray(nums) {\n  // Write your solution here\n  \n}`,
    testCases: [
      { input: "maxSubArray([-2,1,-3,4,-1,2,1,-5,4])", expectedOutput: "6" },
      { input: "maxSubArray([1])", expectedOutput: "1" },
      { input: "maxSubArray([5,4,-1,7,8])", expectedOutput: "23" },
    ],
    timeLimit: 20,
  },
];
