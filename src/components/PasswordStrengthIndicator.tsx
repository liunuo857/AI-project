import React from 'react';
import { Progress, Space, Typography, Alert } from 'antd';
import { 
  checkPasswordStrength, 
  getPasswordStrengthColor, 
  getPasswordStrengthText,
  PASSWORD_RULES 
} from '../utils/passwordValidator';

const { Text } = Typography;

interface PasswordStrengthIndicatorProps {
  password: string;
  showRules?: boolean;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ 
  password, 
  showRules = true 
}) => {
  if (!password) {
    return showRules ? (
      <Alert
        message="密码规则"
        description={
          <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
            <li>长度至少 {PASSWORD_RULES.minLength} 个字符</li>
            <li>包含至少一个大写字母 (A-Z)</li>
            <li>包含至少一个小写字母 (a-z)</li>
            <li>包含至少一个数字 (0-9)</li>
            <li>包含至少一个特殊字符 ({PASSWORD_RULES.specialChars})</li>
            <li>不能使用常见的弱密码</li>
          </ul>
        }
        type="info"
        showIcon
        style={{ marginTop: 8 }}
      />
    ) : null;
  }

  const result = checkPasswordStrength(password);
  const color = getPasswordStrengthColor(result.strength);
  const text = getPasswordStrengthText(result.strength);

  return (
    <Space direction="vertical" style={{ width: '100%', marginTop: 8 }}>
      <div>
        <Text style={{ marginRight: 8 }}>密码强度：</Text>
        <Text strong style={{ color }}>
          {text}
        </Text>
      </div>
      
      <Progress 
        percent={result.score} 
        strokeColor={color}
        showInfo={false}
        size="small"
      />

      {result.feedback.length > 0 && (
        <Alert
          message="密码建议"
          description={
            <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
              {result.feedback.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          }
          type="warning"
          showIcon
        />
      )}

      {result.passed && (
        <Alert
          message="密码强度良好"
          description="您的密码符合安全要求"
          type="success"
          showIcon
        />
      )}
    </Space>
  );
};

export default PasswordStrengthIndicator;
