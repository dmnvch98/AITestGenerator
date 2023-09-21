package com.example.aitestgenerator.repositories;

import com.example.aitestgenerator.models.Test;
import com.example.aitestgenerator.models.Text;
import org.junit.jupiter.api.Disabled;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;


@SpringBootTest
@Disabled
class TestTwoRepositoryTest {

    @Autowired
    private TextRepository textRepository;

    @Autowired
    private TestTwoRepository testTwoRepository;

    @org.junit.jupiter.api.Test
    void testSave() {
        Text textTwo = textRepository.findById(1L).orElse(null);
        Test testTwo = Test.builder()
            .textId(textTwo.getId())
            .userId(textTwo.getUserId())
            .title("Some test")
            .build();
        Test two = testTwoRepository.save(testTwo);

        System.out.println(two);
    }

}