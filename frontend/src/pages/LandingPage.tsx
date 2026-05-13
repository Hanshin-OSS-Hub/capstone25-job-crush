import React from "react";
import { Link } from "react-router-dom";
import {
  FaChartLine,
  FaComments,
  FaCog,
  FaFileAlt,
  FaMicrophone,
  FaSearch,
} from "react-icons/fa";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(60,80,224,0.12),transparent)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-12">
            <div className="max-w-xl lg:max-w-none">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary sm:text-sm">
                AI Career Assistant
              </p>
              <h1 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                합격을 부르는 AI 취업 파트너,{" "}
                <span className="text-primary">Job Crush</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-gray-600 sm:text-xl">
                이력서 분석부터 모의 면접까지, 인공지능과 함께 가장 완벽한 취업
                준비를 경험하세요.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-4 text-center text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:bg-primary/90 active:scale-100"
                >
                  무료로 시작하기
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center rounded-xl border-2 border-gray-200 bg-white px-8 py-4 text-center text-base font-semibold text-gray-800 transition-all hover:scale-105 hover:border-primary hover:text-primary active:scale-100"
                >
                  서비스 둘러보기
                </a>
              </div>
              <p className="mt-8 text-sm leading-relaxed text-gray-500">
                몇 분 안에 첫 분석을 완료할 수 있습니다
              </p>
            </div>

            {/* Dashboard preview */}
            <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none">
              <div
                className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-gray-100 blur-2xl"
                aria-hidden
              />
              <div className="relative rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl shadow-gray-200/80 sm:p-6">
                <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      성장 대시보드
                    </p>
                    <p className="mt-1 text-lg font-bold text-gray-900">
                      이번 주 준비 요약
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
                    <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
                    <span className="h-2.5 w-2.5 rounded-full bg-primary/40" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="rounded-xl bg-gray-50 p-4 transition-all hover:shadow-md">
                    <p className="text-xs font-medium text-gray-500">
                      이력서 점수
                    </p>
                    <p className="mt-2 text-2xl font-bold tabular-nums text-primary">
                      87
                      <span className="text-base font-semibold text-gray-400">
                        /100
                      </span>
                    </p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full w-[87%] rounded-full bg-primary transition-all"
                        aria-hidden
                      />
                    </div>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4 transition-all hover:shadow-md">
                    <p className="text-xs font-medium text-gray-500">
                      모의 면접
                    </p>
                    <p className="mt-2 text-2xl font-bold tabular-nums text-gray-900">
                      12
                      <span className="text-sm font-medium text-gray-500">
                        회
                      </span>
                    </p>
                    <div className="mt-3 flex items-end gap-1">
                      {[40, 65, 55, 80, 70, 92].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t bg-primary/25 transition-all hover:bg-primary/40"
                          style={{ height: `${h}px` }}
                          aria-hidden
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-800">
                      최근 피드백 하이라이트
                    </p>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      +4 이번 주
                    </span>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 shrink-0 rounded-lg bg-primary/10" />
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="h-2 w-3/4 rounded bg-gray-100" />
                        <div className="h-2 w-1/2 rounded bg-gray-50" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 shrink-0 rounded-lg bg-gray-100" />
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="h-2 w-2/3 rounded bg-gray-100" />
                        <div className="h-2 w-5/12 rounded bg-gray-50" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="scroll-mt-20 border-t border-gray-100 bg-gray-50 py-20 sm:py-24 lg:py-28"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              핵심 기능
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              취업 준비의 모든 단계를 하나의 흐름으로 연결합니다.
            </p>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3 md:gap-6 lg:mt-16 lg:gap-8">
            <article className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:scale-105 hover:shadow-lg">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <FaFileAlt className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                AI 이력서 분석
              </h3>
              <p className="mt-3 flex-1 text-base leading-relaxed text-gray-600">
                JD와의 적합도, 문장의 임팩트, 키워드까지 세밀하게 진단합니다.
                수정 포인트를 우선순위로 정리해 바로 손볼 수 있습니다.
              </p>
            </article>
            <article className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:scale-105 hover:shadow-lg">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <FaMicrophone className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                실전 모의 면접
              </h3>
              <p className="mt-3 flex-1 text-base leading-relaxed text-gray-600">
                직무와 경력에 맞춘 질문으로 말하기 연습을 하고, 답변 구조와
                전달력에 대한 즉각적인 피드백을 받을 수 있습니다.
              </p>
            </article>
            <article className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:scale-105 hover:shadow-lg">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <FaChartLine className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="text-xl font-bold text-gray-900">성장 대시보드</h3>
              <p className="mt-3 flex-1 text-base leading-relaxed text-gray-600">
                분석 이력과 면접 세션을 한눈에 모아, 약점을 줄이고 강점을
                누적하는 패턴을 시각적으로 확인합니다.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-white py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              이용 방법
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              세 단계로 끝나는 취업 준비 사이클
            </p>
          </div>

          <div className="relative mt-16 lg:mt-20">
            <div
              className="absolute left-8 top-12 hidden h-0.5 w-[calc(100%-4rem)] bg-gradient-to-r from-primary/30 via-primary to-primary/30 lg:left-[12.5%] lg:block lg:w-[75%]"
              aria-hidden
            />
            <ol className="grid gap-10 lg:grid-cols-3 lg:gap-8">
              <li className="relative flex flex-col items-center text-center lg:items-start lg:text-left">
                <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-white shadow-lg shadow-primary/30">
                  1
                </div>
                <div className="mt-6 flex items-center gap-2 lg:mt-8">
                  <FaCog className="h-5 w-5 text-primary" aria-hidden />
                  <h3 className="text-lg font-bold text-gray-900">설정</h3>
                </div>
                <p className="mt-3 max-w-sm text-base leading-relaxed text-gray-600">
                  목표 직무와 이력 정보를 입력합니다. 이후 모든 분석과 질문이 이
                  맥락에 맞춰 정교해집니다.
                </p>
              </li>
              <li className="relative flex flex-col items-center text-center lg:items-start lg:text-left">
                <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-white shadow-lg shadow-primary/30">
                  2
                </div>
                <div className="mt-6 flex items-center gap-2 lg:mt-8">
                  <FaSearch className="h-5 w-5 text-primary" aria-hidden />
                  <h3 className="text-lg font-bold text-gray-900">분석</h3>
                </div>
                <p className="mt-3 max-w-sm text-base leading-relaxed text-gray-600">
                  이력서와 면접 답변을 AI가 종합적으로 살펴보고, 직무 요구와의
                  간극과 개선이 필요한 지점을 구체적으로 정리해 줍니다.
                </p>
              </li>
              <li className="relative flex flex-col items-center text-center lg:items-start lg:text-left">
                <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-white shadow-lg shadow-primary/30">
                  3
                </div>
                <div className="mt-6 flex items-center gap-2 lg:mt-8">
                  <FaComments className="h-5 w-5 text-primary" aria-hidden />
                  <h3 className="text-lg font-bold text-gray-900">피드백</h3>
                </div>
                <p className="mt-3 max-w-sm text-base leading-relaxed text-gray-600">
                  구체적인 수정 가이드와 면접 팁을 받고, 대시보드에서 성장
                  추이를 추적합니다.
                </p>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 bg-gray-50 py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold leading-snug tracking-tight text-gray-900 sm:text-4xl">
            더 이상 취업 준비로 막막해하지 마세요.{" "}
            <span className="text-primary">지금 바로 Job Crush</span>와
            시작하세요.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
            프로 수준의 인사이트를, 복잡한 도구 없이 바로 경험해 보세요.
          </p>
          <Link
            to="/signup"
            className="mt-10 inline-flex min-w-[200px] items-center justify-center rounded-xl bg-primary px-12 py-5 text-lg font-semibold text-white shadow-xl shadow-primary/25 transition-all hover:scale-105 hover:bg-primary/90 active:scale-100"
          >
            지금 시작하기
          </Link>
          <p className="mt-8 text-sm text-gray-500">
            이미 계정이 있으신가요?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              로그인
            </Link>
          </p>
        </div>
      </section>

      <footer className="border-t border-gray-100 bg-white py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-gray-500 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Job Crush. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
