package com.example.generation_service.annotations.cid;

import com.example.generation_service.annotations.enumeration.CidType;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

import static com.example.generation_service.utils.Utils.generateRandomCid;

@Aspect
@Component
public class CidAspect {

    @Before("@annotation(generateCid)")
    public void addCidToMDC(GenerateCid generateCid) {
        final CidType cidType = generateCid.value();
        String cid;

        switch (cidType) {
            case RANDOM:
                cid = generateRandomCid();
                break;
            default:
                cid = String.valueOf(System.currentTimeMillis());
                break;
        }

        MDC.put("cid", cid);
    }

    @After("@annotation(com.example.generation_service.annotations.cid.GenerateCid)")
    public void clearMdc() {
        MDC.clear();
    }

}
