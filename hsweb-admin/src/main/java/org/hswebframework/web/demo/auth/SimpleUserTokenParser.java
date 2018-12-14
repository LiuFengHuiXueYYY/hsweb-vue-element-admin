/**
 * 
 */
package org.hswebframework.web.demo.auth;

import javax.servlet.http.HttpServletRequest;
import org.apache.commons.lang3.StringUtils;
import org.hswebframework.web.authorization.basic.web.ParsedToken;
import org.hswebframework.web.authorization.basic.web.UserTokenParser;
import org.springframework.stereotype.Component;

@Component
public class SimpleUserTokenParser implements UserTokenParser {
    @Override
    public ParsedToken parseToken(HttpServletRequest request) {
        //获取参数中的token
        String token = request.getHeader("token"); 
        String ptoken = request.getParameter("token");
        if(StringUtils.isEmpty(token) && StringUtils.isEmpty(ptoken))return null;
        return new ParsedToken() {
            @Override
            public String getToken() {
            	if (StringUtils.isNotBlank(ptoken)) {
					return ptoken;
				}
                return token;
            }

            @Override
            public String getType() {
                return "token";
            }
        };
    }
}
