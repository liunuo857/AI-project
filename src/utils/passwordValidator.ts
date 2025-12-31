/**
 * 密码强度等级
 */
export enum PasswordStrength {
  WEAK = 'weak',
  MEDIUM = 'medium',
  STRONG = 'strong',
  VERY_STRONG = 'very_strong',
}

/**
 * 密码强度结果
 */
export interface PasswordStrengthResult {
  strength: PasswordStrength;
  score: number; // 0-100
  feedback: string[];
  passed: boolean;
}

/**
 * 密码规则
 */
export const PASSWORD_RULES = {
  minLength: 8,
  maxLength: 32,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
  specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

/**
 * 检查密码强度
 */
export const checkPasswordStrength = (password: string): PasswordStrengthResult => {
  const feedback: string[] = [];
  let score = 0;

  // 检查长度
  if (password.length < PASSWORD_RULES.minLength) {
    feedback.push(`密码长度至少需要 ${PASSWORD_RULES.minLength} 个字符`);
  } else if (password.length >= PASSWORD_RULES.minLength && password.length < 12) {
    score += 20;
  } else if (password.length >= 12 && password.length < 16) {
    score += 30;
  } else {
    score += 40;
  }

  // 检查大写字母
  if (!/[A-Z]/.test(password)) {
    feedback.push('密码需要包含至少一个大写字母');
  } else {
    score += 15;
  }

  // 检查小写字母
  if (!/[a-z]/.test(password)) {
    feedback.push('密码需要包含至少一个小写字母');
  } else {
    score += 15;
  }

  // 检查数字
  if (!/\d/.test(password)) {
    feedback.push('密码需要包含至少一个数字');
  } else {
    score += 15;
  }

  // 检查特殊字符
  const specialCharRegex = new RegExp(`[${PASSWORD_RULES.specialChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`);
  if (!specialCharRegex.test(password)) {
    feedback.push(`密码需要包含至少一个特殊字符 (${PASSWORD_RULES.specialChars})`);
  } else {
    score += 15;
  }

  // 检查是否包含常见弱密码模式
  const weakPatterns = [
    /^123456/,
    /^password/i,
    /^qwerty/i,
    /^abc123/i,
    /^111111/,
    /^admin/i,
  ];

  for (const pattern of weakPatterns) {
    if (pattern.test(password)) {
      feedback.push('密码不能使用常见的弱密码模式');
      score = Math.max(0, score - 30);
      break;
    }
  }

  // 检查字符多样性
  const uniqueChars = new Set(password).size;
  if (uniqueChars / password.length > 0.7) {
    score += 10;
  }

  // 确定强度等级
  let strength: PasswordStrength;
  if (score < 40) {
    strength = PasswordStrength.WEAK;
  } else if (score < 60) {
    strength = PasswordStrength.MEDIUM;
  } else if (score < 80) {
    strength = PasswordStrength.STRONG;
  } else {
    strength = PasswordStrength.VERY_STRONG;
  }

  const passed = feedback.length === 0 && score >= 60;

  return {
    strength,
    score: Math.min(100, score),
    feedback,
    passed,
  };
};

/**
 * 获取密码强度颜色
 */
export const getPasswordStrengthColor = (strength: PasswordStrength): string => {
  switch (strength) {
    case PasswordStrength.WEAK:
      return '#ff4d4f';
    case PasswordStrength.MEDIUM:
      return '#faad14';
    case PasswordStrength.STRONG:
      return '#52c41a';
    case PasswordStrength.VERY_STRONG:
      return '#1890ff';
    default:
      return '#d9d9d9';
  }
};

/**
 * 获取密码强度文本
 */
export const getPasswordStrengthText = (strength: PasswordStrength): string => {
  switch (strength) {
    case PasswordStrength.WEAK:
      return '弱';
    case PasswordStrength.MEDIUM:
      return '中等';
    case PasswordStrength.STRONG:
      return '强';
    case PasswordStrength.VERY_STRONG:
      return '非常强';
    default:
      return '';
  }
};

/**
 * 检查密码是否过期（示例：90天）
 */
export const isPasswordExpired = (lastChangeDate: Date, expiryDays: number = 90): boolean => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastChangeDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > expiryDays;
};

/**
 * 获取密码过期剩余天数
 */
export const getPasswordExpiryDays = (lastChangeDate: Date, expiryDays: number = 90): number => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastChangeDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, expiryDays - diffDays);
};
