import { NotAcceptableException } from '@nestjs/common';
import { Info, Int, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class TestResolver {
  @Query(() => Int)
  testQuery(@Info() info) {
    const testVar1 = 'hello';
    const testVar2 = 'world';

    throw new NotAcceptableException('testing error');
  }
}
