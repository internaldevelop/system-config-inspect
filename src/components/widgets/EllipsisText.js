import React from 'react';
import { Tooltip, Typography, Input } from 'antd';

const { Paragraph } = Typography;

class EllipsisText extends React.Component {
    
    render() {
        const { content, width } = this.props;
        // 对于可排序的列，单元格 paragraph 宽度 = 列宽-33
        return (
            <Tooltip placement="topLeft" title={content}>
                <Paragraph ellipsis={{ rows: 1, expandable: false }} style={{ width: width - 33 }}>{content}</Paragraph>
            </Tooltip>
        );
    }
}

export default EllipsisText;